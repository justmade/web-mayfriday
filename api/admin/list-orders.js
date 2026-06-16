import redis, { get } from '../_redis.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  if (req.query.adminPassword !== (process.env.ADMIN_PASSWORD || 'admin123')) {
    return res.status(401).json({ success: false, error: '管理员密码错误 / Invalid admin password' })
  }

  try {
    const ids = await redis.lrange('orders:recent', 0, 199)
    const orders = (await Promise.all(ids.map((id) => get(`order:${id}`)))).filter(Boolean)
    return res.json({ success: true, orders })
  } catch (error) {
    console.error('List orders error:', error)
    return res.status(500).json({ success: false, error: '获取订单失败 / Failed to load orders' })
  }
}
