/* global Buffer, process */
import jwt from 'jsonwebtoken'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  signatureUrl: vi.fn((name) => `https://oss.example/${name}?Signature=signed`),
}))

vi.mock('./_oss.js', () => ({
  getOssClient: () => ({ get: mocks.get, signatureUrl: mocks.signatureUrl }),
}))

const { default: handler } = await import('./hls-playlist.js')

function request(path, token) {
  return { method: 'GET', query: { path, t: token } }
}

function response() {
  const res = {}
  res.status = vi.fn(() => res)
  res.json = vi.fn(() => res)
  res.set = vi.fn(() => res)
  res.send = vi.fn(() => res)
  return res
}

beforeEach(() => {
  vi.clearAllMocks()
  process.env.JWT_SECRET = 'hls-playlist-test-secret'
  mocks.get.mockResolvedValue({
    content: Buffer.from('#EXTM3U\n#EXT-X-MAP:URI="init.mp4"\n#EXTINF:10,\nsegment-000.ts\n'),
  })
})

describe('hls-playlist', () => {
  it('rejects a token issued for a different playlist', async () => {
    const token = jwt.sign(
      { type: 'video', path: 'courses/course1/playlist.m3u8', phone: '13800138000' },
      process.env.JWT_SECRET,
      { expiresIn: '5m' },
    )
    const res = response()

    await handler(request('courses/course3/playlist.m3u8', token), res)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(mocks.get).not.toHaveBeenCalled()
  })

  it('returns a no-store playlist with every media URI signed', async () => {
    const objectPath = 'courses/course1/playlist.m3u8'
    const token = jwt.sign(
      { type: 'video', path: objectPath, phone: '13800138000' },
      process.env.JWT_SECRET,
      { expiresIn: '5m' },
    )
    const res = response()

    await handler(request(objectPath, token), res)

    const playlist = res.send.mock.calls.at(-1)[0]
    expect(res.set).toHaveBeenCalledWith('Cache-Control', 'private, no-store')
    expect(playlist).toMatch(/^#EXTM3U/)
    expect(playlist).toContain('URI="https://oss.example/courses/course1/init.mp4?Signature=signed"')
    expect(playlist).toContain('https://oss.example/courses/course1/segment-000.ts?Signature=signed')
  })
})
