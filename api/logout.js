/**
 * 退出登录 API
 * Logout and invalidate token
 */

import { get, set, del } from './_redis.js'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // 1. 获取令牌 / Get token
    const authHeader = req.headers.authorization
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return res.json({
        success: true,
        message: '已退出登录 / Logged out'
      })
    }

    // 2. 验证JWT / Verify JWT
    const secret = process.env.JWT_SECRET || 'development-secret-key-change-in-production'
    let decoded

    try {
      decoded = jwt.verify(token, secret)
    } catch (err) {
      // Token already invalid, just return success
      return res.json({
        success: true,
        message: '已退出登录 / Logged out'
      })
    }

    // 3. 删除令牌信息 / Delete token info
    await del(`token:${token}`)

    // 4. 更新用户数据，移除当前令牌 / Update user data, remove current token
    const user = await get(`user:${decoded.phone}`)

    if (user && user.currentToken === token) {
      user.currentToken = null
      user.currentDevice = null
      user.deviceName = null
      await set(`user:${decoded.phone}`, user)
    }

    // 5. 返回成功 / Return success
    res.json({
      success: true,
      message: '已退出登录 / Logged out successfully'
    })

  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({
      success: false,
      error: '退出失败 / Logout failed'
    })
  }
}
