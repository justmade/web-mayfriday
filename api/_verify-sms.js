/**
 * 统一短信验证入口
 * Unified SMS verification — production uses Alibaba Cloud PNVS,
 * test mode falls back to Redis-stored codes.
 */

import { get, set, del } from './_redis.js'
import { isSmsConfigured, checkSmsCode } from './_sms.js'

/**
 * 验证短信验证码
 * @returns {Promise<true|string>} true 表示成功，字符串为错误信息
 */
export async function verifySmsCode(phone, code) {
  if (isSmsConfigured()) {
    // 生产模式：调用阿里云 PNVS 核验
    const passed = await checkSmsCode(phone, code)
    return passed ? true : '验证码错误或已过期 / Code incorrect or expired'
  }

  // 测试模式：从 Redis 读取比对
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
