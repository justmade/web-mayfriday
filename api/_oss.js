/* global process */
import OSS from 'ali-oss'

let client

export function getOssClient() {
  if (client) return client

  const required = ['OSS_ACCESS_KEY_ID', 'OSS_ACCESS_KEY_SECRET', 'OSS_BUCKET', 'OSS_REGION']
  const missing = required.filter((name) => !process.env[name])
  if (missing.length) {
    throw new Error(`OSS configuration missing: ${missing.join(', ')}`)
  }

  client = new OSS({
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
    bucket: process.env.OSS_BUCKET,
    region: process.env.OSS_REGION,
    secure: true,
  })

  return client
}
