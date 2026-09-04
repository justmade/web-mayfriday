/**
 * 激活课程 API
 * Authenticated users can activate a course without another SMS challenge.
 */

import redis from './_redis.js'
import { authenticate } from './_auth.js'

export const activateCourseScript = `
local codeJson = redis.call('GET', KEYS[1])
if not codeJson then
  return cjson.encode({ ok = false, reason = 'NOT_FOUND' })
end

local code = cjson.decode(codeJson)
if code.used then
  return cjson.encode({ ok = false, reason = 'USED', usedBy = code.usedBy })
end

if code.expiresAt and code.expiresAt ~= cjson.null and code.expiresAt < ARGV[2] then
  return cjson.encode({ ok = false, reason = 'EXPIRED' })
end

local userJson = redis.call('GET', KEYS[2])
if not userJson then
  return cjson.encode({ ok = false, reason = 'USER_NOT_FOUND' })
end

local user = cjson.decode(userJson)
if type(user.courses) ~= 'table' then
  user.courses = {}
end

local hasCourse = false
for _, courseId in ipairs(user.courses) do
  if courseId == code.courseId then
    hasCourse = true
    break
  end
end
if not hasCourse then
  table.insert(user.courses, code.courseId)
end

code.used = true
code.usedBy = ARGV[1]
code.usedAt = ARGV[2]
user.updatedAt = ARGV[2]

redis.call('SET', KEYS[1], cjson.encode(code))
redis.call('SET', KEYS[2], cjson.encode(user))

return cjson.encode({ ok = true, courseId = code.courseId })
`

function activationError(result) {
  if (result.reason === 'NOT_FOUND') {
    return '激活码不存在 / Activation code not found'
  }
  if (result.reason === 'USED') {
    return `激活码已被使用 / Activation code already used${result.usedBy ? ` by ${result.usedBy}` : ''}`
  }
  if (result.reason === 'EXPIRED') {
    return '激活码已过期 / Activation code expired'
  }
  if (result.reason === 'USER_NOT_FOUND') {
    return '用户不存在 / User not found'
  }
  return '激活失败，请重试 / Activation failed, please try again'
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const auth = await authenticate(req)
    if (!auth.ok) {
      return res.status(auth.status).json({
        success: false,
        error: auth.error,
        ...(auth.kicked ? { kicked: true } : {}),
      })
    }

    const activationCode = String(req.body?.activationCode || '').trim().toUpperCase()
    if (!activationCode) {
      return res.status(400).json({
        success: false,
        error: '缺少激活码 / Missing activation code',
      })
    }

    const now = new Date().toISOString()
    const rawResult = await redis.eval(
      activateCourseScript,
      2,
      `code:${activationCode}`,
      `user:${auth.phone}`,
      auth.phone,
      now,
    )
    const result = JSON.parse(rawResult)

    if (!result.ok) {
      const status = result.reason === 'USER_NOT_FOUND' ? 404 : 400
      return res.status(status).json({ success: false, error: activationError(result) })
    }

    return res.json({
      success: true,
      courseId: result.courseId,
      message: '课程激活成功 / Course activated successfully',
    })
  } catch (error) {
    console.error('Activate course error:', error)
    return res.status(500).json({
      success: false,
      error: '激活失败，请重试 / Activation failed, please try again',
    })
  }
}
