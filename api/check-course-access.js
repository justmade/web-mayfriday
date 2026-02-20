/**
 * 验证课程访问权限 API
 * Check if user has access to a specific course
 */

import { get } from './_redis.js'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { courseId } = req.query

  if (!courseId) {
    return res.status(400).json({
      success: false,
      error: '缺少课程ID / Missing course ID'
    })
  }

  try {
    // 1. 获取并验证令牌 / Get and verify token
    const authHeader = req.headers.authorization
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({
        success: false,
        hasAccess: false,
        error: '请先登录 / Please login first'
      })
    }

    // 2. 验证JWT / Verify JWT
    const secret = process.env.JWT_SECRET || 'development-secret-key-change-in-production'
    let decoded

    try {
      decoded = jwt.verify(token, secret)
    } catch (err) {
      return res.status(401).json({
        success: false,
        hasAccess: false,
        error: '登录已过期 / Session expired'
      })
    }

    // 3. 检查令牌是否在KV中 / Check if token exists in KV
    const tokenInfo = await get(`token:${token}`)

    if (!tokenInfo) {
      return res.status(401).json({
        success: false,
        hasAccess: false,
        error: '您的账号已在其他设备登录 / Your account is logged in on another device',
        kicked: true
      })
    }

    // 4. 验证设备指纹 / Verify device fingerprint
    if (tokenInfo.deviceId !== decoded.deviceId) {
      return res.status(401).json({
        success: false,
        hasAccess: false,
        error: '设备验证失败 / Device verification failed'
      })
    }

    // 5. 获取用户数据 / Get user data
    const user = await get(`user:${decoded.phone}`)

    if (!user) {
      return res.status(404).json({
        success: false,
        hasAccess: false,
        error: '用户不存在 / User not found'
      })
    }

    // 6. 检查用户是否有该课程的访问权限 / Check if user has access to course
    const hasAccess = user.courses.includes(courseId)

    if (!hasAccess) {
      return res.json({
        success: true,
        hasAccess: false,
        error: '您还没有购买此课程 / You have not purchased this course'
      })
    }

    // 7. 返回成功 / Return success
    res.json({
      success: true,
      hasAccess: true
    })

  } catch (error) {
    console.error('Check course access error:', error)
    res.status(500).json({
      success: false,
      hasAccess: false,
      error: '验证失败 / Verification failed'
    })
  }
}
