import crypto from 'node:crypto'
import { getConfiguredPrice, products } from '../src/data/products.js'
import redis, { set } from './_redis.js'

const phonePattern = /^1\d{10}$/

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { customer, items } = req.body || {}
  if (!customer?.name || !phonePattern.test(customer?.phone || '') || !customer?.address) {
    return res.status(400).json({ success: false, error: '请填写有效的收货信息 / Invalid shipping details' })
  }
  if (!Array.isArray(items) || items.length === 0 || items.length > 30) {
    return res.status(400).json({ success: false, error: '购物车为空或商品数量异常 / Invalid cart' })
  }

  try {
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
        phone: customer.phone,
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
  } catch (error) {
    console.error('Create order error:', error)
    return res.status(400).json({ success: false, error: error.message || '订单提交失败 / Failed to submit order' })
  }
}
