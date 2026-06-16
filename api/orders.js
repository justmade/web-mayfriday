/* global process */
import crypto from 'node:crypto'
import redis, { get, set } from './_redis.js'
import { getConfiguredPrice, products } from '../shared/products.js'

const phonePattern = /^1[0-9]{10}$/
const allowedStatuses = new Set(['pending_confirmation', 'contacted', 'paid', 'shipped', 'cancelled'])

function isAdminPassword(value) {
  return value === (process.env.ADMIN_PASSWORD || 'admin123')
}

async function createOrder(req, res) {
  const { customer, items } = req.body || {}
  const phone = String(customer?.phone || '').replace(/[^\d]/g, '')
  if (!customer?.name || !phonePattern.test(phone) || !customer?.address) {
    return res.status(400).json({ success: false, error: '请填写有效的收货信息 / Invalid shipping details' })
  }
  if (!Array.isArray(items) || items.length === 0 || items.length > 30) {
    return res.status(400).json({ success: false, error: '购物车为空或商品数量异常 / Invalid cart' })
  }

  const normalizedItems = items.map((item) => {
    const product = products.find((candidate) => candidate.id === item.productId)
    const quantity = Number(item.quantity)
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > product.stock) {
      throw new Error('商品或数量无效 / Invalid product or quantity')
    }

    const selections = {}
    const selectedOptions = (product.options || []).map((option) => {
      const selected = option.values.find((value) => value.id === item.selections?.[option.id])
      if (!selected) throw new Error('商品规格无效 / Invalid product option')
      selections[option.id] = selected.id
      return {
        optionId: option.id,
        optionName: option.name,
        valueId: selected.id,
        valueName: selected.name,
      }
    })

    const unitPrice = getConfiguredPrice(product, selections)
    return { productId: product.id, name: product.name, quantity, unitPrice, subtotal: unitPrice * quantity, selectedOptions }
  })

  const orderId = `MF${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
  const order = {
    id: orderId,
    status: 'pending_confirmation',
    customer: {
      name: customer.name.trim().slice(0, 50),
      phone,
      address: customer.address.trim().slice(0, 300),
      contactMethod: customer.contactMethod === 'wechat' ? 'wechat' : 'phone',
      note: String(customer.note || '').trim().slice(0, 500),
    },
    items: normalizedItems,
    total: normalizedItems.reduce((sum, item) => sum + item.subtotal, 0),
    createdAt: new Date().toISOString(),
  }

  await set(`order:${orderId}`, order, 90 * 24 * 60 * 60)
  await redis.lpush('orders:recent', orderId)
  await redis.ltrim('orders:recent', 0, 499)

  return res.status(201).json({ success: true, order: { id: order.id, status: order.status, total: order.total } })
}

async function listOrders(req, res) {
  if (!isAdminPassword(req.query.adminPassword)) {
    return res.status(401).json({ success: false, error: '管理员密码错误 / Invalid admin password' })
  }

  const ids = await redis.lrange('orders:recent', 0, 199)
  const orders = (await Promise.all(ids.map((id) => get(`order:${id}`)))).filter(Boolean)
  return res.json({ success: true, orders })
}

async function updateOrder(req, res) {
  if (!isAdminPassword(req.body?.adminPassword)) {
    return res.status(401).json({ success: false, error: '管理员密码错误 / Invalid admin password' })
  }
  if (!allowedStatuses.has(req.body?.status)) {
    return res.status(400).json({ success: false, error: '订单状态无效 / Invalid order status' })
  }

  const order = await get(`order:${req.body.orderId}`)
  if (!order) return res.status(404).json({ success: false, error: '订单不存在 / Order not found' })

  const updated = { ...order, status: req.body.status, updatedAt: new Date().toISOString() }
  await set(`order:${order.id}`, updated, 90 * 24 * 60 * 60)
  return res.json({ success: true, order: updated })
}

export default async function handler(req, res) {
  try {
    if (req.method === 'POST' && req.body?.action === 'updateStatus') return updateOrder(req, res)
    if (req.method === 'POST') return createOrder(req, res)
    if (req.method === 'GET') return listOrders(req, res)
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Orders API error:', error)
    return res.status(500).json({ success: false, error: error.message || '订单处理失败 / Failed to process order' })
  }
}
