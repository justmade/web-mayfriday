/**
 * 发送短信验证码 API
 * Send SMS verification code
 *
 * NOTE: This is a MOCK implementation for development.
 * Replace with actual Alibaba Cloud SMS service in production.
 */

import { get, set } from './_redis.js'

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

    // 3. 生成6位随机验证码 / Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // 4. 发送短信（MOCK - 实际生产环境需要替换为真实的阿里云SMS调用）
    // Send SMS (MOCK - Replace with real Alibaba Cloud SMS in production)

    // TODO: Replace with actual Alibaba Cloud SMS implementation
    /*
    const client = new alibabaCloudSMS.default({
      accessKeyId: process.env.SMS_ACCESS_KEY_ID,
      accessKeySecret: process.env.SMS_ACCESS_KEY_SECRET,
      endpoint: 'dysmsapi.aliyuncs.com'
    })

    await client.sendSms({
      phoneNumbers: phone,
      signName: process.env.SMS_SIGN_NAME,
      templateCode: process.env.SMS_TEMPLATE_CODE,
      templateParam: JSON.stringify({ code })
    })
    */

    // MOCK: Console log for development
    console.log(`[MOCK SMS] 发送验证码到 ${phone}: ${code}`)
    console.log(`[MOCK SMS] Verification code sent to ${phone}: ${code}`)

    // 5. 保存验证码到Redis（5分钟过期）/ Save to Redis (5 min expiry)
    await set(`sms:${phone}`, {
      code,
      expiresAt: Date.now() + 300000,  // 5 minutes
      attempts: 0,
      lastSentAt: Date.now()
    }, 300)

    // Return success
    const response = {
      success: true,
      message: '验证码已发送 / Verification code sent'
    }

    // 如果没有配置阿里云短信，返回验证码用于测试
    // If SMS service not configured, return code for testing
    const smsConfigured = process.env.SMS_ACCESS_KEY_ID &&
                          process.env.SMS_ACCESS_KEY_SECRET &&
                          process.env.SMS_SIGN_NAME &&
                          process.env.SMS_TEMPLATE_CODE

    if (!smsConfigured) {
      // 测试模式：直接返回验证码
      response.devCode = code
      response.testMode = true
      console.log(`[TEST MODE] 验证码: ${code}`)
    }

    res.json(response)

  } catch (error) {
    console.error('Send SMS error:', error)
    res.status(500).json({
      success: false,
      error: '发送失败，请重试 / Failed to send, please try again'
    })
  }
}
