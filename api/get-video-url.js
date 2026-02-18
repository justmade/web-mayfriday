/**
 * Vercel Serverless Function
 * 生成阿里云OSS私有视频的临时签名URL
 */

const OSS = require('ali-oss')

export default async function handler(req, res) {
  // 只允许GET请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // 获取视频路径参数
  const { path } = req.query

  if (!path) {
    return res.status(400).json({ error: 'Missing video path parameter' })
  }

  // 验证环境变量
  if (!process.env.OSS_ACCESS_KEY_ID || !process.env.OSS_ACCESS_KEY_SECRET) {
    return res.status(500).json({ error: 'OSS credentials not configured' })
  }

  try {
    // 创建OSS客户端
    const client = new OSS({
      accessKeyId: process.env.OSS_ACCESS_KEY_ID,
      accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
      bucket: process.env.OSS_BUCKET || 'web-mayfriday-videos',
      region: process.env.OSS_REGION || 'oss-cn-beijing'
    })

    // 生成24小时有效的签名URL
    const signedUrl = client.signatureUrl(path, {
      expires: 86400, // 24小时 = 86400秒
      response: {
        'content-type': 'video/mp4',
      }
    })

    // 返回签名URL
    return res.status(200).json({
      url: signedUrl,
      expiresIn: 86400
    })
  } catch (error) {
    console.error('OSS签名URL生成失败:', error)
    return res.status(500).json({
      error: 'Failed to generate signed URL',
      message: error.message
    })
  }
}
