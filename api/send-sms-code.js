/**
 * 发送短信验证码 API
 * Send SMS verification code
 *
 * 生产模式（SMS_* 环境变量已配置）：调用阿里云号码认证服务（PNVS），验证码由阿里云托管。
 * 测试模式（未配置）：生成验证码存 Redis，响应中返回 devCode 供前端弹窗显示。
 */

import { get, set } from './_redis.js'
import { isSmsConfigured, sendSmsCode } from './_sms.js'

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { phone } = req.body

  // 1. 验证手机号格式 / Validate phone number format
  if (!phone || !/^1\d{10}$/.test(phone)) {
    return res.status(400).json({
      success: false,
      error: '手机号格式错误 / Invalid phone number format'
    })
  }

  try {
    // 2. 检查防刷限制 / Check rate limiting (60 seconds)
    const lastSMS = await get(`sms:${phone}`)

    if (lastSMS && Date.now() - lastSMS.lastSentAt < 60000) {
      const waitTime = Math.ceil((60000 - (Date.now() - lastSMS.lastSentAt)) / 1000)
      return res.status(429).json({
        success: false,
        error: `请${waitTime}秒后再试 / Please try again in ${waitTime} seconds`
      })
    }

    const response = {
      success: true,
      message: '验证码已发送 / Verification code sent'
    }

    // 生成验证码，无论生产/测试模式都存入 Redis
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    if (isSmsConfigured()) {
      // 生产模式：PNVS 发送短信，code 同时存 Redis 用于验证
      await sendSmsCode(phone, code)
    } else {
      // 测试模式：不发真实短信，返回 devCode 供前端弹窗显示
      response.devCode = code
      response.testMode = true
      console.log(`[TEST MODE] 验证码: ${code}`)
    }

    await set(`sms:${phone}`, {
      code,
      expiresAt: Date.now() + 300000,  // 5 minutes
      attempts: 0,
      lastSentAt: Date.now()
    }, 300)

    res.json(response)

  } catch (error) {
    console.error('Send SMS error:', error)
    res.status(500).json({
      success: false,
      error: '发送失败，请重试 / Failed to send, please try again'
    })
  }
}
