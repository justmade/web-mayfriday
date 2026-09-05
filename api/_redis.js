/* global process */
/**
 * Redis 辅助工具
 * Redis helper utility for ioredis
 */

import Redis from 'ioredis'

const redisUrl = process.env.REDIS_URL

if (!redisUrl) {
  throw new Error('REDIS_URL 未配置 / REDIS_URL is not configured')
}

const redis = new Redis(redisUrl, {
  lazyConnect: true,
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => Math.min(times * 200, 3000),
})

// 长驻进程必须消费 error 事件，避免 Redis 短暂断线导致 Node 进程退出。
redis.on('error', (error) => {
  console.error('[redis]', error.message)
})

/**
 * 获取数据（自动 JSON 解析）
 */
export async function get(key) {
  const data = await redis.get(key)
  return data ? JSON.parse(data) : null
}

/**
 * 设置数据（自动 JSON 序列化，支持 TTL）
 * @param {string} key - Redis key
 * @param {any} value - Value to store
 * @param {number} ttl - Time to live in seconds (optional)
 */
export async function set(key, value, ttl) {
  const serialized = JSON.stringify(value)
  if (ttl) {
    await redis.set(key, serialized, 'EX', ttl)
  } else {
    await redis.set(key, serialized)
  }
}

/**
 * 删除数据
 */
export async function del(key) {
  await redis.del(key)
}

/**
 * 按模式扫描 key（游标分批，替代 KEYS）
 *
 * KEYS 是 O(N) 阻塞命令，会占住 Redis 单线程直到扫完整个键空间；本服务是
 * 单进程 Express，一次慢查询会拖住全站所有请求。SCAN 每次只扫一小批，
 * 把停顿摊薄到多次往返。
 *
 * SCAN 可能返回重复 key（扩缩容 rehash 期间），因此用 Set 去重。
 *
 * @param {string} pattern - 匹配模式，如 'user:*'
 * @param {{count?: number, limit?: number}} options
 * @returns {Promise<{keys: string[], truncated: boolean}>}
 */
export async function scanKeys(pattern, { count = 500, limit = 20000 } = {}) {
  const found = new Set()
  let cursor = '0'

  do {
    const [nextCursor, batch] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', count)
    cursor = nextCursor

    for (const key of batch) {
      found.add(key)
      // 兜底：键空间异常膨胀时不要把整个进程的内存和响应体撑爆
      if (found.size >= limit) return { keys: [...found], truncated: true }
    }
  } while (cursor !== '0')

  return { keys: [...found], truncated: false }
}

/**
 * 分批 MGET
 *
 * 一次性 MGET 上万个 key 同样是一条巨型命令，会阻塞 Redis 并可能超出
 * 协议缓冲区。分批发送，单批控制在可控规模。
 */
export async function mgetChunked(keys, chunkSize = 200) {
  const values = []
  for (let index = 0; index < keys.length; index += chunkSize) {
    values.push(...await redis.mget(keys.slice(index, index + chunkSize)))
  }
  return values
}

export default redis
