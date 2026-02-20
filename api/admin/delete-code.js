/**
 * 删除激活码 API (管理员)
 * Delete activation code (Admin only)
 */

import { del } from '../_redis.js'

export default async function handler(req, res) {
  if (req.method !== 'DELETE' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { code, adminPassword } = req.body

  // 管理员密码验证
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

  if (adminPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({
      success: false,
      error: '管理员密码错误 / Invalid admin password'
    })
  }

  if (!code) {
    return res.status(400).json({
      success: false,
      error: '缺少激活码 / Missing code'
    })
  }

  try {
    // 删除激活码
    await del(`code:${code}`)

    res.json({
      success: true,
      message: '激活码已删除 / Code deleted successfully',
      code
    })

  } catch (error) {
    console.error('Delete code error:', error)
    res.status(500).json({
      success: false,
      error: '删除失败 / Failed to delete code'
    })
  }
}
