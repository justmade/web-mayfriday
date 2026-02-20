/**
 * 登录 API
 * User login with phone and SMS code
 */

import { get, set, del } from './_redis.js'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { phone, smsCode, deviceId, deviceName } = req.body

  // Validate required fields
  if (!phone || !smsCode || !deviceId || !deviceName) {
    return res.status(400).json({
      success: false,
      error: '缺少必填字段 / Missing required fields'
    })
  }

  try {
    // 1. 验证短信验证码 / Verify SMS code
    const smsData = await get(`sms:${phone}`)

    if (!smsData) {
      return res.status(400).json({
        success: false,
        error: '验证码不存在或已过期 / Code not found or expired'
      })
    }

    if (smsData.code !== smsCode) {
      // 增加尝试次数 / Increment attempts
      smsData.attempts = (smsData.attempts || 0) + 1

      if (smsData.attempts >= 3) {
        await del(`sms:${phone}`)
        return res.status(400).json({
          success: false,
          error: '验证码错误次数过多，请重新获取 / Too many attempts, please get a new code'
        })
      }

      await set(`sms:${phone}`, smsData, \1)

      return res.status(400).json({
        success: false,
        error: '验证码错误 / Incorrect verification code'
      })
    }

    if (Date.now() > smsData.expiresAt) {
      return res.status(400).json({
        success: false,
        error: '验证码已过期 / Verification code expired'
      })
    }

    // 2. 检查用户是否存在 / Check if user exists
    const user = await get(`user:${phone}`)

    if (!user) {
      return res.status(404).json({
        success: false,
        error: '用户不存在，请先激活课程 / User not found, please activate a course first'
      })
    }

    // 3. 生成JWT令牌（30天有效）/ Generate JWT token (30 days)
    const secret = process.env.JWT_SECRET || 'development-secret-key-change-in-production'
    const token = jwt.sign(
      {
        phone,
        deviceId
      },
      secret,
      { expiresIn: '30d' }
    )

    // 4. 更新用户数据（单设备限制）/ Update user (single device restriction)
    if (user.currentToken) {
      // 删除旧设备的令牌 / Delete old device token
      await del(`token:${user.currentToken}`)
    }

    user.currentDevice = deviceId
    user.deviceName = deviceName
    user.currentToken = token
    user.lastLoginAt = new Date().toISOString()

    // 5. 保存数据 / Save data
    await Promise.all([
      // Save user data
      set(`user:${phone}`, user),

      // Save token info (30 days TTL)
      set(`token:${token}`, {
        phone,
        deviceId,
        issuedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30*24*60*60*1000).toISOString()
      }, \1),

      // Delete SMS code
      del(`sms:${phone}`)
    ])

    // 6. 返回成功响应 / Return success response
    res.json({
      success: true,
      token,
      courses: user.courses,
      message: '登录成功 / Login successful'
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      error: '登录失败，请重试 / Login failed, please try again'
    })
  }
}
