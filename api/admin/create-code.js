/**
 * 创建激活码 API (管理员)
 * Create activation code (Admin only)
 */

import { get, set } from '../_redis.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { code, courseId, adminPassword } = req.body

  // 简单的管理员密码验证
  // 生产环境请使用更安全的认证方式
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

  if (adminPassword !== ADMIN_PASSWORD) {
    return res.status(401).json({
      success: false,
      error: '管理员密码错误 / Invalid admin password'
    })
  }

  // 验证必填字段
  if (!code || !courseId) {
    return res.status(400).json({
      success: false,
      error: '缺少必填字段 / Missing required fields'
    })
  }

  // 验证激活码格式（建议格式：KNIT2024-XXXXX）
  if (!/^[A-Z0-9-]+$/.test(code)) {
    return res.status(400).json({
      success: false,
      error: '激活码格式错误，只能包含大写字母、数字和横杠 / Invalid code format'
    })
  }

  try {
    // 检查激活码是否已存在
    const existing = await get(`code:${code}`)
    if (existing) {
      return res.status(400).json({
        success: false,
        error: '激活码已存在 / Code already exists'
      })
    }

    // 创建激活码数据
    const codeData = {
      courseId: parseInt(courseId),
      used: false,
      usedBy: null,
      createdAt: new Date().toISOString(),
      expiresAt: null
    }

    // 保存到 Redis
    await set(`code:${code}`, codeData)

    res.json({
      success: true,
      message: '激活码创建成功 / Code created successfully',
      code,
      data: codeData
    })

  } catch (error) {
    console.error('Create code error:', error)
    res.status(500).json({
      success: false,
      error: '创建失败 / Failed to create code'
    })
  }
}
