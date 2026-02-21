/**
 * 激活课程 API
 * Activate course with activation code and SMS verification
 */

import { get, set, del } from './_redis.js'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { activationCode, phone, smsCode, deviceId, deviceName } = req.body

  // Validate required fields
  if (!activationCode || !phone || !smsCode || !deviceId || !deviceName) {
    return res.status(400).json({
      success: false,
      error: '缺少必填字段 / Missing required fields'
    })
  }

  try {
    // 0. 如果用户已登录，验证手机号一致性 / If user is logged in, verify phone number matches
    const authHeader = req.headers.authorization
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '')
        const secret = process.env.JWT_SECRET || 'development-secret-key-change-in-production'
        const decoded = jwt.verify(token, secret)

        // 验证提交的手机号与登录账号的手机号一致
        // Verify submitted phone matches logged-in account phone
        if (decoded.phone !== phone) {
          return res.status(400).json({
            success: false,
            error: '请使用当前登录账号的手机号激活课程 / Please use current account phone number to activate'
          })
        }
      } catch (err) {
        // Token 无效或过期，忽略（允许继续激活）
        // Invalid or expired token, ignore (allow activation to proceed)
        console.log('Token verification failed in activate-course:', err.message)
      }
    }

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
        // 锁定5分钟 / Lock for 5 minutes
        await del(`sms:${phone}`)
        return res.status(400).json({
          success: false,
          error: '验证码错误次数过多，请重新获取 / Too many attempts, please get a new code'
        })
      }

      await set(`sms:${phone}`, smsData, 300)

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

    // 2. 验证激活码 / Verify activation code
    const codeData = await get(`code:${activationCode}`)

    if (!codeData) {
      return res.status(400).json({
        success: false,
        error: '激活码不存在 / Activation code not found'
      })
    }

    if (codeData.used) {
      return res.status(400).json({
        success: false,
        error: `激活码已被使用 / Activation code already used${codeData.usedBy ? ` by ${codeData.usedBy}` : ''}`
      })
    }

    if (codeData.expiresAt && Date.now() > new Date(codeData.expiresAt).getTime()) {
      return res.status(400).json({
        success: false,
        error: '激活码已过期 / Activation code expired'
      })
    }

    // 3. 获取或创建用户 / Get or create user
    let user = await get(`user:${phone}`)

    if (!user) {
      // 新用户（通过激活码直接创建）
      // New user (created via activation)
      user = {
        phone,
        courses: [],
        createdAt: new Date().toISOString()
      }
    }
    // 如果用户已存在（可能是注册用户），保留原有属性
    // If user exists (may be registered user), preserve existing properties

    // 4. 添加课程到用户账户 / Add course to user account
    if (!user.courses.includes(codeData.courseId)) {
      user.courses.push(codeData.courseId)
    }

    // 5. 生成JWT令牌（30天有效）/ Generate JWT token (30 days)
    const secret = process.env.JWT_SECRET || 'development-secret-key-change-in-production'
    const token = jwt.sign(
      {
        phone,
        deviceId
      },
      secret,
      { expiresIn: '30d' }
    )

    // 6. 更新用户数据（单设备限制）/ Update user (single device restriction)
    if (user.currentToken) {
      // 删除旧设备的令牌 / Delete old device token
      await del(`token:${user.currentToken}`)
    }

    user.currentDevice = deviceId
    user.deviceName = deviceName
    user.currentToken = token
    user.lastLoginAt = new Date().toISOString()

    // 7. 保存所有数据 / Save all data
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

      // Mark activation code as used
      set(`code:${activationCode}`, {
        ...codeData,
        used: true,
        usedBy: phone,
        usedAt: new Date().toISOString()
      }),

      // Delete SMS code
      del(`sms:${phone}`)
    ])

    // 8. 返回成功响应 / Return success response
    res.json({
      success: true,
      token,
      courseId: codeData.courseId,
      message: '课程激活成功 / Course activated successfully'
    })

  } catch (error) {
    console.error('Activate course error:', error)
    res.status(500).json({
      success: false,
      error: '激活失败，请重试 / Activation failed, please try again'
    })
  }
}
