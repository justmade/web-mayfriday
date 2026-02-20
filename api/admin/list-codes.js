/**
 * 列出所有激活码 API (管理员)
 * List all activation codes (Admin only)
 */

import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { adminPassword } = req.query

  // 管理员密码验证
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

  if (adminPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({
      success: false,
      error: '管理员密码错误 / Invalid admin password'
    })
  }

  try {
    // 获取所有激活码的 keys
    const keys = await redis.keys('code:*')

    if (keys.length === 0) {
      return res.json({
        success: true,
        codes: [],
        total: 0
      })
    }

    // 批量获取所有激活码数据
    const values = await redis.mget(keys)

    // 解析并组合数据
    const codes = keys.map((key, index) => {
      const code = key.replace('code:', '')
      const data = values[index] ? JSON.parse(values[index]) : null

      return {
        code,
        ...data
      }
    }).filter(Boolean)

    // 按创建时间倒序排列
    codes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    res.json({
      success: true,
      codes,
      total: codes.length
    })

  } catch (error) {
    console.error('List codes error:', error)
    res.status(500).json({
      success: false,
      error: '获取失败 / Failed to list codes'
    })
  }
}
