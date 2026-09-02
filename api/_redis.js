/* global process */
/**
 * Redis 辅助工具
 * Redis helper utility for ioredis
 */

import Redis from 'ioredis'

// Vercel 在 Redis 集成变量重名后会使用这个带项目后缀的名称。
// 保留之前使用过的名称和 REDIS_URL，兼容旧部署与本地开发。
const redisUrl = process.env.REDIS_URL_mayinfriday_REDIS_URL
  || process.env.mayinfriday_REDIS_URL
  || process.env.REDIS_URL
const redis = new Redis(redisUrl)

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
