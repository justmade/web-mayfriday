/* global process */
import jwt from 'jsonwebtoken'
import { get } from './_redis.js'

function failure(status, error, extra = {}) {
  return { ok: false, status, error, ...extra }
}

export async function authenticate(req) {
  const authHeader = req.headers?.authorization
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length).trim()
    : ''

  if (!token) {
    return failure(401, '请先登录 / Please login first')
  }

  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET 未配置 / JWT_SECRET is not configured')
  }

  let decoded
  try {
    decoded = jwt.verify(token, secret)
  } catch {
    return failure(401, '登录已过期 / Session expired')
  }

  const tokenInfo = await get(`token:${token}`)
  if (!tokenInfo) {
    return failure(
      401,
      '您的账号已在其他设备登录 / Your account is logged in on another device',
      { kicked: true },
    )
  }

  if (tokenInfo.deviceId !== decoded.deviceId) {
    return failure(401, '设备验证失败 / Device verification failed')
  }

  const user = await get(`user:${decoded.phone}`)
  if (!user) {
    return failure(404, '用户不存在 / User not found')
  }

  return { ok: true, phone: decoded.phone, token, user }
}
