/**
 * 环境变量检查接口（仅用于调试）
 */

export default async function handler(req, res) {
  return res.status(200).json({
    hasAccessKeyId: !!process.env.OSS_ACCESS_KEY_ID,
    hasAccessKeySecret: !!process.env.OSS_ACCESS_KEY_SECRET,
    hasBucket: !!process.env.OSS_BUCKET,
    hasRegion: !!process.env.OSS_REGION,
    accessKeyIdLength: process.env.OSS_ACCESS_KEY_ID?.length || 0,
    accessKeySecretLength: process.env.OSS_ACCESS_KEY_SECRET?.length || 0,
    bucket: process.env.OSS_BUCKET || 'not set',
    region: process.env.OSS_REGION || 'not set',
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV
  })
}
