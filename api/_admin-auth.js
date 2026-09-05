/* global process */
import crypto from 'node:crypto'
import redis from './_redis.js'

const MAX_ATTEMPTS = 10
const WINDOW_SECONDS = 15 * 60

function secureEqual(supplied, expected) {
  const suppliedHash = crypto.createHash('sha256').update(String(supplied)).digest()
  const expectedHash = crypto.createHash('sha256').update(String(expected)).digest()
  return crypto.timingSafeEqual(suppliedHash, expectedHash)
}

function requestIp(req) {
  const realIp = req.headers?.['x-real-ip']
  if (realIp) return String(realIp).trim()

  const forwarded = String(req.headers?.['x-forwarded-for'] || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
  return forwarded.at(-1) || req.socket?.remoteAddress || 'unknown'
}

export async function requireAdmin(req, res) {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) {
    res.status(500).json({
      success: false,
      error: '服务未配置管理员密码 / Admin password is not configured',
    })
    return false
  }

  const attemptKey = `admin:fail:${requestIp(req)}`
  const failures = Number(await redis.get(attemptKey)) || 0
  if (failures >= MAX_ATTEMPTS) {
    res.status(429).json({
      success: false,
      error: '尝试次数过多，请15分钟后再试 / Too many attempts, try again in 15 minutes',
    })
    return false
  }

  const supplied = req.headers?.['x-admin-password'] || ''
  if (!secureEqual(supplied, expected)) {
    await redis.multi().incr(attemptKey).expire(attemptKey, WINDOW_SECONDS).exec()
    res.status(401).json({
      success: false,
      error: '管理员密码错误 / Invalid admin password',
    })
    return false
  }

  await redis.del(attemptKey)
  return true
}

export { MAX_ATTEMPTS, WINDOW_SECONDS }
