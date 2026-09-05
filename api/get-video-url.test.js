import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  authenticate: vi.fn(),
  signatureUrl: vi.fn(() => 'https://oss.example/signed'),
}))

vi.mock('./_auth.js', () => ({ authenticate: mocks.authenticate }))
vi.mock('./_oss.js', () => ({
  getOssClient: () => ({ signatureUrl: mocks.signatureUrl }),
}))

const { default: handler } = await import('./get-video-url.js')

function request(path) {
  return { method: 'GET', query: { path }, headers: {} }
}

function response() {
  const res = {}
  res.status = vi.fn(() => res)
  res.json = vi.fn(() => res)
  return res
}

beforeEach(() => vi.clearAllMocks())

describe('get-video-url', () => {
  it('rejects non-course and traversal paths before authentication', async () => {
    for (const objectPath of ['resources/private.mp4', '../courses/course1/video.mp4']) {
      const res = response()
      await handler(request(objectPath), res)
      expect(res.status).toHaveBeenCalledWith(400)
    }
    expect(mocks.authenticate).not.toHaveBeenCalled()
  })

  it('rejects a user without access to the requested course', async () => {
    mocks.authenticate.mockResolvedValue({ ok: true, user: { courses: [] } })
    const res = response()

    await handler(request('courses/course1/video.mp4'), res)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(mocks.signatureUrl).not.toHaveBeenCalled()
  })

  it('signs only an accessible course object for four hours', async () => {
    mocks.authenticate.mockResolvedValue({ ok: true, user: { courses: ['course2'] } })
    const res = response()

    await handler(request('courses/course2/video.mp4'), res)

    expect(mocks.signatureUrl).toHaveBeenCalledWith('courses/course2/video.mp4', { expires: 14400 })
    expect(res.json).toHaveBeenCalledWith({ url: 'https://oss.example/signed', expiresIn: 14400 })
  })
})
