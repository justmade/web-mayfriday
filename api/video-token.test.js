/* global process */
import jwt from 'jsonwebtoken'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({ authenticate: vi.fn() }))

vi.mock('./_auth.js', () => ({ authenticate: mocks.authenticate }))

const { default: handler } = await import('./video-token.js')

function request(path, token = '') {
  return {
    method: 'POST',
    body: { path },
    headers: token ? { authorization: `Bearer ${token}` } : {},
  }
}

function response() {
  const res = {}
  res.status = vi.fn(() => res)
  res.json = vi.fn(() => res)
  return res
}

beforeEach(() => {
  vi.clearAllMocks()
  process.env.JWT_SECRET = 'video-token-test-secret'
})

describe('video-token', () => {
  it('rejects unauthenticated course requests', async () => {
    mocks.authenticate.mockResolvedValue({ ok: false, status: 401, error: '请先登录' })
    const res = response()

    await handler(request('courses/course1/playlist.m3u8'), res)

    expect(res.status).toHaveBeenCalledWith(401)
  })

  it('rejects users without course access', async () => {
    mocks.authenticate.mockResolvedValue({ ok: true, phone: '13800138000', user: { courses: [] } })
    const res = response()

    await handler(request('courses/course2/inkle-basics/playlist.m3u8', 'login-token'), res)

    expect(res.status).toHaveBeenCalledWith(403)
  })

  it('returns a path-bound short-lived token for a purchased course', async () => {
    mocks.authenticate.mockResolvedValue({
      ok: true,
      phone: '13800138000',
      user: { courses: ['course3'] },
    })
    const res = response()

    await handler(request('courses/course3/playlist.m3u8', 'login-token'), res)

    const payload = res.json.mock.calls.at(-1)[0]
    const decoded = jwt.verify(payload.token, process.env.JWT_SECRET)
    expect(payload.expiresIn).toBe(300)
    expect(decoded).toMatchObject({ type: 'video', path: 'courses/course3/playlist.m3u8' })
  })

  it('allows an exact public resource playlist without login', async () => {
    const res = response()

    await handler(request('resources/mini-heddle-latvia-pattern/playlist.m3u8'), res)

    expect(res.json).toHaveBeenCalledWith({ success: true, public: true })
    expect(mocks.authenticate).not.toHaveBeenCalled()
  })
})
