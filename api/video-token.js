/* global process */
import jwt from 'jsonwebtoken'

import { authenticate } from './_auth.js'
import {
  COURSE_PLAYLISTS,
  PUBLIC_RESOURCE_PLAYLISTS,
  normalizeObjectPath,
  userCanAccessCourse,
} from './_video-access.js'

const TOKEN_TTL_SECONDS = 5 * 60

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  const objectPath = normalizeObjectPath(req.body?.path)
  if (!objectPath) {
    return res.status(400).json({ success: false, error: '无效的视频路径 / Invalid video path' })
  }

  if (PUBLIC_RESOURCE_PLAYLISTS.has(objectPath)) {
    return res.json({ success: true, public: true })
  }

  const courseId = COURSE_PLAYLISTS.get(objectPath)
  if (!courseId) {
    return res.status(404).json({ success: false, error: '视频不存在 / Video not found' })
  }

  try {
    const auth = await authenticate(req)
    if (!auth.ok) {
      return res.status(auth.status).json({
        success: false,
        error: auth.error,
        ...(auth.kicked ? { kicked: true } : {}),
      })
    }

    if (!userCanAccessCourse(auth.user, courseId)) {
      return res.status(403).json({
        success: false,
        error: '您还没有购买此课程 / You have not purchased this course',
      })
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET 未配置 / JWT_SECRET is not configured')
    }

    const token = jwt.sign(
      { type: 'video', path: objectPath, phone: auth.phone },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_TTL_SECONDS },
    )

    return res.json({ success: true, token, expiresIn: TOKEN_TTL_SECONDS })
  } catch (error) {
    console.error('Video token error:', error)
    return res.status(500).json({ success: false, error: '视频鉴权失败 / Video authorization failed' })
  }
}
