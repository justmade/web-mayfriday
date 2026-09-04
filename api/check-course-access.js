/**
 * 验证课程访问权限 API
 * Check if user has access to a specific course
 */

import { authenticate } from './_auth.js'
import { isMembershipActive } from './_membership.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { courseId } = req.query

  if (!courseId) {
    return res.status(400).json({
      success: false,
      error: '缺少课程ID / Missing course ID'
    })
  }

  try {
    const auth = await authenticate(req)
    if (!auth.ok) {
      return res.status(auth.status).json({
        success: false,
        hasAccess: false,
        error: auth.error,
        ...(auth.kicked ? { kicked: true } : {}),
      })
    }

    const { user } = auth

    // 6. 有效会员可访问全部课程 / Active members can access all courses
    if (isMembershipActive(user.membership)) {
      return res.json({
        success: true,
        hasAccess: true,
        membership: user.membership,
      })
    }

    // 7. 检查用户是否有该课程的访问权限 / Check if user has access to course
    const hasAccess = (user.courses || []).includes(courseId)

    if (!hasAccess) {
      return res.json({
        success: true,
        hasAccess: false,
        error: '您还没有购买此课程 / You have not purchased this course'
      })
    }

    // 8. 返回成功 / Return success
    res.json({
      success: true,
      hasAccess: true
    })

  } catch (error) {
    console.error('Check course access error:', error)
    res.status(500).json({
      success: false,
      hasAccess: false,
      error: '验证失败 / Verification failed'
    })
  }
}
