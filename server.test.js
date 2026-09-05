/* global process */
import { afterAll, describe, expect, it, vi } from 'vitest'

process.env.NODE_ENV = 'test'
process.env.REDIS_URL ||= 'redis://127.0.0.1:6399'

const { default: app, distDirectory } = await import('./server.js')
const { default: redis } = await import('./api/_redis.js')

const routeLayers = app._router.stack.filter((layer) => layer.route)

afterAll(() => {
  redis.disconnect()
})

describe('Aliyun Express entrypoint', () => {
  it('uses the repository dist directory by default', () => {
    expect(distDirectory).toBe(`${process.cwd()}/dist`)
  })

  it('serves the process health endpoint', () => {
    const healthRoute = routeLayers.find((layer) => layer.route.path === '/healthz')
    const json = vi.fn()

    healthRoute.route.stack[0].handle({}, { json })

    expect(json).toHaveBeenCalledWith({ ok: true })
  })

  it('registers every API route before the SPA fallback', () => {
    const paths = routeLayers.map((layer) => layer.route.path)
    const fallbackIndex = paths.indexOf('*')
    const apiPaths = [
      '/api/login',
      '/api/register',
      '/api/logout',
      '/api/send-sms-code',
      '/api/activate-course',
      '/api/check-course-access',
      '/api/get-user-courses',
      '/api/get-video-url',
      '/api/video-token',
      '/api/hls-playlist',
      '/api/products',
      '/api/orders',
      '/api/admin',
    ]

    expect(fallbackIndex).toBeGreaterThan(-1)
    for (const path of apiPaths) {
      const routeIndex = paths.indexOf(path)
      expect(routeIndex).toBeGreaterThan(-1)
      expect(routeIndex).toBeLessThan(fallbackIndex)
    }
  })

  it('lets handlers return JSON method errors instead of falling into the SPA', () => {
    const loginRoute = routeLayers.find((layer) => layer.route.path === '/api/login')

    expect(loginRoute.route.methods.get).toBe(true)
    expect(loginRoute.route.methods.post).toBe(true)
  })
})
