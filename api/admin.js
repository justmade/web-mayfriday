/* global process */
import redis, { del, get, set } from './_redis.js'
import { getProductCatalog, getProductCategories, normalizeProduct, saveProductCatalog } from './_products.js'

function isAdminPassword(value) {
  return value === (process.env.ADMIN_PASSWORD || 'admin123')
}

function requireAdmin(req, res) {
  const password = req.method === 'GET' ? req.query.adminPassword : req.body?.adminPassword
  if (isAdminPassword(password)) return true
  res.status(401).json({ success: false, error: '管理员密码错误 / Invalid admin password' })
  return false
}

async function listCodes(req, res) {
  const keys = await redis.keys('code:*')
  if (keys.length === 0) return res.json({ success: true, codes: [], total: 0 })

  const values = await redis.mget(keys)
  const codes = keys.map((key, index) => {
    const code = key.replace('code:', '')
    const data = values[index] ? JSON.parse(values[index]) : null
    return data ? { code, ...data } : null
  }).filter(Boolean)

  codes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return res.json({ success: true, codes, total: codes.length })
}

async function createCode(req, res) {
  const { code, courseId } = req.body
  if (!code || !courseId) return res.status(400).json({ success: false, error: '缺少必填字段 / Missing required fields' })
  if (!/^[A-Z0-9-]+$/.test(code)) {
    return res.status(400).json({ success: false, error: '激活码格式错误，只能包含大写字母、数字和横杠 / Invalid code format' })
  }

  const existing = await get(`code:${code}`)
  if (existing) return res.status(400).json({ success: false, error: '激活码已存在 / Code already exists' })

  const codeData = {
    courseId,
    used: false,
    usedBy: null,
    createdAt: new Date().toISOString(),
    expiresAt: null,
  }
  await set(`code:${code}`, codeData)
  return res.json({ success: true, message: '激活码创建成功 / Code created successfully', code, data: codeData })
}

async function deleteCode(req, res) {
  const { code } = req.body
  if (!code) return res.status(400).json({ success: false, error: '缺少激活码 / Missing code' })
  await del(`code:${code}`)
  return res.json({ success: true, message: '激活码已删除 / Code deleted successfully', code })
}

async function listProducts(req, res) {
  const products = await getProductCatalog({ includeInactive: true })
  return res.json({ success: true, products, categories: getProductCategories() })
}

async function upsertProduct(req, res) {
  const product = normalizeProduct(req.body.product || {})
  const products = await getProductCatalog({ includeInactive: true })
  const index = products.findIndex((item) => item.id === product.id)
  const nextProducts = index >= 0 ? products.map((item) => item.id === product.id ? product : item) : [product, ...products]
  await saveProductCatalog(nextProducts)
  return res.json({ success: true, product, products: nextProducts })
}

async function deleteProduct(req, res) {
  const productId = String(req.body.productId || '').trim()
  if (!productId) return res.status(400).json({ success: false, error: '缺少商品 ID / Missing product ID' })
  const products = await getProductCatalog({ includeInactive: true })
  const nextProducts = products.filter((product) => product.id !== productId)
  await saveProductCatalog(nextProducts)
  return res.json({ success: true, productId, products: nextProducts })
}

export default async function handler(req, res) {
  if (!requireAdmin(req, res)) return

  try {
    const action = req.method === 'GET' ? req.query.action : req.body?.action

    if (req.method === 'GET' && action === 'listCodes') return listCodes(req, res)
    if (req.method === 'GET' && action === 'listProducts') return listProducts(req, res)
    if (req.method === 'POST' && action === 'createCode') return createCode(req, res)
    if (req.method === 'POST' && action === 'deleteCode') return deleteCode(req, res)
    if (req.method === 'POST' && action === 'upsertProduct') return upsertProduct(req, res)
    if (req.method === 'POST' && action === 'deleteProduct') return deleteProduct(req, res)

    return res.status(400).json({ success: false, error: '后台操作无效 / Invalid admin action' })
  } catch (error) {
    console.error('Admin API error:', error)
    return res.status(500).json({ success: false, error: error.message || '后台操作失败 / Admin action failed' })
  }
}
