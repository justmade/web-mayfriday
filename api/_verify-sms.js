/**
 * 统一短信验证入口（生产/测试模式均从 Redis 比对）
 * PNVS 只负责发送短信，code 始终由调用方生成并存储在 Redis 中。
 */

import { get, set, del } from './_redis.js'

/**
 * 验证短信验证码
 * @returns {Promise<true|string>} true 表示成功，字符串为错误信息
 */
export async function verifySmsCode(phone, code) {
  const smsData = await get(`sms:${phone}`)

  if (!smsData) {
    return '验证码不存在或已过期 / Code not found or expired'
  }

  if (Date.now() > smsData.expiresAt) {
    await del(`sms:${phone}`)
    return '验证码已过期 / Verification code expired'
  }

  if (smsData.code !== code) {
    smsData.attempts = (smsData.attempts || 0) + 1
    if (smsData.attempts >= 3) {
      await del(`sms:${phone}`)
      return '验证码错误次数过多，请重新获取 / Too many attempts, please get a new code'
    }
    await set(`sms:${phone}`, smsData, 300)
    return '验证码错误 / Incorrect verification code'
  }

  await del(`sms:${phone}`)
  return true
}
