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

export default redis
