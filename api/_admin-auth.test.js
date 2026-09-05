/* global process */
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  const exec = vi.fn()
  const chain = {
    incr: vi.fn(),
    expire: vi.fn(),
    exec,
  }
  chain.incr.mockReturnValue(chain)
  chain.expire.mockReturnValue(chain)

  return {
    chain,
    del: vi.fn(),
    exec,
    get: vi.fn(),
    multi: vi.fn(() => chain),
  }
})

vi.mock('./_redis.js', () => ({
  default: {
    del: mocks.del,
    get: mocks.get,
    multi: mocks.multi,
  },
}))

const { MAX_ATTEMPTS, requireAdmin } = await import('./_admin-auth.js')

function request(password, extra = {}) {
  return {
    headers: {
      'x-admin-password': password,
      'x-real-ip': '203.0.113.10',
      ...extra,
    },
    socket: { remoteAddress: '127.0.0.1' },
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
  process.env.ADMIN_PASSWORD = 'a-long-test-admin-password'
  mocks.get.mockResolvedValue(null)
  mocks.exec.mockResolvedValue([])
})

describe('requireAdmin', () => {
  it('allows the configured password and clears prior failures', async () => {
    const res = response()

    await expect(requireAdmin(request(process.env.ADMIN_PASSWORD), res)).resolves.toBe(true)

    expect(mocks.del).toHaveBeenCalledWith('admin:fail:203.0.113.10')
    expect(res.status).not.toHaveBeenCalled()
  })

  it('rejects an incorrect password and increments the failure count', async () => {
    const res = response()

    await expect(requireAdmin(request('wrong'), res)).resolves.toBe(false)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(mocks.chain.incr).toHaveBeenCalledWith('admin:fail:203.0.113.10')
    expect(mocks.chain.expire).toHaveBeenCalledWith('admin:fail:203.0.113.10', 900)
  })

  it('rate limits an IP after ten failures', async () => {
    mocks.get.mockResolvedValue(String(MAX_ATTEMPTS))
    const res = response()

    await expect(requireAdmin(request(process.env.ADMIN_PASSWORD), res)).resolves.toBe(false)

    expect(res.status).toHaveBeenCalledWith(429)
    expect(mocks.multi).not.toHaveBeenCalled()
  })

  it('fails closed when ADMIN_PASSWORD is missing', async () => {
    delete process.env.ADMIN_PASSWORD
    const res = response()

    await expect(requireAdmin({
      ...request('admin123'),
      query: { adminPassword: 'admin123' },
      body: { adminPassword: 'admin123' },
    }, res)).resolves.toBe(false)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(mocks.get).not.toHaveBeenCalled()
  })
})
