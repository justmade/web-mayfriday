/* global process */
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  scan: vi.fn(),
  mget: vi.fn(),
  on: vi.fn(),
}))

vi.mock('ioredis', () => ({
  default: class {
    constructor() {
      this.scan = mocks.scan
      this.mget = mocks.mget
      this.on = mocks.on
    }
  },
}))

process.env.REDIS_URL = 'redis://127.0.0.1:6399'
const { mgetChunked, scanKeys } = await import('./_redis.js')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('scanKeys', () => {
  it('follows the cursor until it returns to 0', async () => {
    mocks.scan
      .mockResolvedValueOnce(['17', ['user:1', 'user:2']])
      .mockResolvedValueOnce(['42', ['user:3']])
      .mockResolvedValueOnce(['0', ['user:4']])

    const { keys, truncated } = await scanKeys('user:*')

    expect(mocks.scan).toHaveBeenCalledTimes(3)
    expect(mocks.scan).toHaveBeenNthCalledWith(1, '0', 'MATCH', 'user:*', 'COUNT', 500)
    expect(mocks.scan).toHaveBeenNthCalledWith(2, '17', 'MATCH', 'user:*', 'COUNT', 500)
    expect(keys).toEqual(['user:1', 'user:2', 'user:3', 'user:4'])
    expect(truncated).toBe(false)
  })

  it('de-duplicates keys that SCAN returns more than once', async () => {
    // SCAN 在 rehash 期间可能重复返回同一个 key，这不是异常情况
    mocks.scan
      .mockResolvedValueOnce(['9', ['code:A', 'code:B']])
      .mockResolvedValueOnce(['0', ['code:B', 'code:C']])

    const { keys } = await scanKeys('code:*')

    expect(keys).toEqual(['code:A', 'code:B', 'code:C'])
  })

  it('stops and flags truncation once the limit is reached', async () => {
    mocks.scan.mockResolvedValue(['5', ['user:1', 'user:2', 'user:3']])

    const { keys, truncated } = await scanKeys('user:*', { limit: 2 })

    expect(keys).toHaveLength(2)
    expect(truncated).toBe(true)
    // 命中上限后必须立刻停下，不能继续跟游标
    expect(mocks.scan).toHaveBeenCalledTimes(1)
  })

  it('returns an empty result without looping when nothing matches', async () => {
    mocks.scan.mockResolvedValueOnce(['0', []])

    const { keys, truncated } = await scanKeys('nope:*')

    expect(keys).toEqual([])
    expect(truncated).toBe(false)
  })
})

describe('mgetChunked', () => {
  it('splits large key lists into several MGET calls and preserves order', async () => {
    const keys = Array.from({ length: 5 }, (_, i) => `k${i}`)
    mocks.mget
      .mockResolvedValueOnce(['v0', 'v1'])
      .mockResolvedValueOnce(['v2', 'v3'])
      .mockResolvedValueOnce(['v4'])

    const values = await mgetChunked(keys, 2)

    expect(mocks.mget).toHaveBeenCalledTimes(3)
    expect(mocks.mget).toHaveBeenNthCalledWith(1, ['k0', 'k1'])
    expect(mocks.mget).toHaveBeenNthCalledWith(3, ['k4'])
    expect(values).toEqual(['v0', 'v1', 'v2', 'v3', 'v4'])
  })

  it('does not call MGET at all for an empty key list', async () => {
    const values = await mgetChunked([], 200)

    expect(mocks.mget).not.toHaveBeenCalled()
    expect(values).toEqual([])
  })
})
