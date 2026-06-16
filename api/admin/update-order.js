import { get, set } from '../_redis.js'

const allowedStatuses = new Set(['pending_confirmation', 'contacted', 'paid', 'shipped', 'cancelled'])

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (req.body?.adminPassword !== (process.env.ADMIN_PASSWORD || 'admin123')) {
    return res.status(401).json({ success: false, error: '管理员密码错误 / Invalid admin password' })
  }
  if (!allowedStatuses.has(req.body?.status)) {
    return res.status(400).json({ success: false, error: '订单状态无效 / Invalid order status' })
  }

  try {
    const order = await get(`order:${req.body.orderId}`)
    if (!order) return res.status(404).json({ success: false, error: '订单不存在 / Order not found' })
    const updated = { ...order, status: req.body.status, updatedAt: new Date().toISOString() }
    await set(`order:${order.id}`, updated, 90 * 24 * 60 * 60)
    return res.json({ success: true, order: updated })
  } catch (error) {
    console.error('Update order error:', error)
    return res.status(500).json({ success: false, error: '更新订单失败 / Failed to update order' })
  }
}
