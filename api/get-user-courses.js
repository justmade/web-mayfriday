/**
 * 获取用户课程列表 API
 * Get user's activated courses
 */

import { get } from './_redis.js'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // 1. 获取并验证令牌 / Get and verify token
    const authHeader = req.headers.authorization
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({
        success: false,
        error: '未登录 / Not authenticated'
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
        error: '登录已过期，请重新登录 / Session expired, please login again'
      })
    }

    // 3. 检查令牌是否在KV中（防止被踢掉）/ Check if token exists in KV
    const tokenInfo = await get(`token:${token}`)

    if (!tokenInfo) {
      return res.status(401).json({
        success: false,
        error: '您的账号已在其他设备登录 / Your account is logged in on another device',
        kicked: true
      })
    }

    // 4. 验证设备指纹 / Verify device fingerprint
    if (tokenInfo.deviceId !== decoded.deviceId) {
      return res.status(401).json({
        success: false,
        error: '设备验证失败 / Device verification failed'
      })
    }

    // 5. 获取用户数据 / Get user data
    const user = await get(`user:${decoded.phone}`)

    if (!user) {
      return res.status(404).json({
        success: false,
        error: '用户不存在 / User not found'
      })
    }

    // 6. 返回课程ID列表 / Return course IDs
    // Note: Frontend will match these IDs with course data from courses.js
    res.json({
      success: true,
      courses: user.courses,
      phone: user.phone,
      deviceName: user.deviceName
    })

  } catch (error) {
    console.error('Get user courses error:', error)
    res.status(500).json({
      success: false,
      error: '获取课程失败 / Failed to get courses'
    })
  }
}
