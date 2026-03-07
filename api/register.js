/**
 * 用户注册 API
 * User registration with phone and SMS verification
 */

import { get, set } from './_redis.js'
import jwt from 'jsonwebtoken'
import { verifySmsCode } from './_verify-sms.js'

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
    const verifyResult = await verifySmsCode(phone, smsCode)
    if (verifyResult !== true) {
      return res.status(400).json({ success: false, error: verifyResult })
    }

    // 2. 检查用户是否已存在 / Check if user already exists
    const existingUser = await get(`user:${phone}`)

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: '该手机号已注册，请直接登录 / Phone number already registered, please login'
      })
    }

    // 3. 创建新用户 / Create new user
    const user = {
      phone,
      courses: [],  // 空课程列表
      registered: true,  // 标记为注册用户
      currentDevice: deviceId,
      deviceName,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    }

    // 4. 生成JWT令牌（30天有效）/ Generate JWT token (30 days)
    const secret = process.env.JWT_SECRET || 'development-secret-key-change-in-production'
    const token = jwt.sign(
      {
        phone,
        deviceId
      },
      secret,
      { expiresIn: '30d' }
    )

    // 5. 更新用户令牌信息 / Update user token
    user.currentToken = token

    // 6. 保存数据 / Save data
    await Promise.all([
      // Save user data
      set(`user:${phone}`, user),

      // Save token info (30 days TTL)
      set(`token:${token}`, {
        phone,
        deviceId,
        issuedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30*24*60*60*1000).toISOString()
      }, 30*24*60*60),
    ])

    // 7. 返回成功响应 / Return success response
    res.json({
      success: true,
      token,
      message: '注册成功 / Registration successful'
    })

  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({
      success: false,
      error: '注册失败，请重试 / Registration failed, please try again'
    })
  }
}
