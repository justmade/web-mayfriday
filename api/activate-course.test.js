/* global process */
import jwt from 'jsonwebtoken'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  eval: vi.fn(),
  get: vi.fn(),
  verifySmsCode: vi.fn(),
}))

vi.mock('./_redis.js', () => ({
  default: { eval: mocks.eval },
  get: mocks.get,
}))

vi.mock('./_verify-sms.js', () => ({
  verifySmsCode: mocks.verifySmsCode,
}))

const { default: handler } = await import('./activate-course.js')

const phone = '13800138000'
const deviceId = 'test-device'
let user

function request(token, body = { activationCode: 'course-code' }) {
  return {
    method: 'POST',
    headers: token ? { authorization: `Bearer ${token}` } : {},
    body,
  }
}

function response() {
  const res = {}
  res.status = vi.fn(() => res)
  res.json = vi.fn(() => res)
  return res
}

function validToken() {
  return jwt.sign({ phone, deviceId }, process.env.JWT_SECRET, { expiresIn: '1h' })
}

beforeEach(() => {
  vi.clearAllMocks()
  process.env.JWT_SECRET = 'activate-course-test-secret'
  user = { phone, courses: [] }
  mocks.get.mockImplementation(async (key) => {
    if (key.startsWith('token:')) return { phone, deviceId }
    if (key === `user:${phone}`) return user
    return null
  })
})

describe('activate-course', () => {
  it('rejects unauthenticated requests without SMS verification', async () => {
    const res = response()

    await handler(request(), res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(mocks.verifySmsCode).not.toHaveBeenCalled()
    expect(mocks.eval).not.toHaveBeenCalled()
  })

  it('rejects an activation code that was already used', async () => {
    mocks.eval.mockResolvedValue(JSON.stringify({
      ok: false,
      reason: 'USED',
      usedBy: '13900139000',
    }))
    const res = response()

    await handler(request(validToken()), res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      error: expect.stringContaining('激活码已被使用'),
    }))
  })

  it('atomically adds the course without replacing the login token', async () => {
    mocks.eval.mockImplementation(async (_script, _keyCount, codeKey, userKey) => {
      expect(codeKey).toBe('code:COURSE-CODE')
      expect(userKey).toBe(`user:${phone}`)
      user.courses.push('course-1')
      return JSON.stringify({ ok: true, courseId: 'course-1' })
    })
    const res = response()

    await handler(request(validToken()), res)

    const payload = res.json.mock.calls.at(-1)[0]
    expect(user.courses).toContain('course-1')
    expect(payload).toMatchObject({ success: true, courseId: 'course-1' })
    expect(payload).not.toHaveProperty('token')
    expect(mocks.verifySmsCode).not.toHaveBeenCalled()
  })
})
