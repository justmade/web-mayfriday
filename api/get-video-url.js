/**
 * Vercel Serverless Function
 * 生成阿里云OSS私有视频的临时签名URL
 */

import { authenticate } from './_auth.js'
import { getOssClient } from './_oss.js'
import { courseIdForObject, normalizeObjectPath, userCanAccessCourse } from './_video-access.js'

export default async function handler(req, res) {
  // 只允许GET请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // 获取视频路径参数
  const objectPath = normalizeObjectPath(req.query?.path)
  const courseId = courseIdForObject(objectPath)
  if (!objectPath || !courseId) {
    return res.status(400).json({ error: 'Invalid video path parameter' })
  }

  try {
    const auth = await authenticate(req)
    if (!auth.ok) {
      return res.status(auth.status).json({ error: auth.error, ...(auth.kicked ? { kicked: true } : {}) })
    }
    if (!userCanAccessCourse(auth.user, courseId)) {
      return res.status(403).json({ error: '您还没有购买此课程 / You have not purchased this course' })
    }

    const signedUrl = getOssClient().signatureUrl(objectPath, { expires: 14400 })

    // 返回签名URL
    return res.status(200).json({
      url: signedUrl,
      expiresIn: 14400
    })
  } catch (error) {
    console.error('OSS签名URL生成失败:', error)
    return res.status(500).json({
      error: 'Failed to generate signed URL'
    })
  }
}
