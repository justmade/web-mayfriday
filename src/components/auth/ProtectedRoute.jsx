import { useEffect, useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useAuthStore from '../../store/authStore'
import { generateDeviceId } from '../../utils/deviceFingerprint'

/**
 * 受保护路由组件
 * Protected route component - requires authentication
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Protected content
 * @param {string} props.courseId - Optional: specific course ID to check access for
 */
function ProtectedRoute({ children, courseId }) {
  const { i18n } = useTranslation()
  const { isLoggedIn, token, checkAuth } = useAuthStore()
  const [hasAccess, setHasAccess] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Check if user is authenticated
    const isAuth = checkAuth()

    if (!isAuth) {
      setLoading(false)
      return
    }

    // If courseId is provided, check course access
    if (courseId && token) {
      checkCourseAccess()
    } else {
      setLoading(false)
      setHasAccess(true)
    }
  }, [courseId, token])

  const checkCourseAccess = async () => {
    try {
      const deviceId = generateDeviceId()

      const res = await fetch(`/api/check-course-access?courseId=${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await res.json()

      if (data.kicked) {
        // User was kicked from another device
        setError('kicked')
      } else if (data.hasAccess) {
        setHasAccess(true)
      } else {
        setHasAccess(false)
        setError(data.error)
      }
    } catch (err) {
      console.error('Check course access error:', err)
      setError('网络错误 / Network error')
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">
            {i18n.language === 'zh' ? '加载中...' : 'Loading...'}
          </p>
        </div>
      </div>
    )
  }

  // Not logged in - redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  // User was kicked from another device
  if (error === 'kicked') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {i18n.language === 'zh' ? '账号已在其他设备登录' : 'Account Logged in on Another Device'}
            </h2>
            <p className="text-gray-600">
              {i18n.language === 'zh'
                ? '检测到您的账号在其他设备上登录，当前设备已自动退出。如果不是您本人操作，请及时联系客服。'
                : 'Your account has been logged in on another device. This session has been terminated. If this was not you, please contact support.'}
            </p>
          </div>

          <Link to="/login" className="btn-primary w-full inline-block">
            {i18n.language === 'zh' ? '重新登录' : 'Login Again'}
          </Link>
        </div>
      </div>
    )
  }

  // Course access check failed
  if (courseId && hasAccess === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {i18n.language === 'zh' ? '您还没有购买此课程' : 'You Have Not Purchased This Course'}
            </h2>
            <p className="text-gray-600 mb-6">
              {i18n.language === 'zh'
                ? '请先在淘宝购买课程并激活，或者查看其他您已购买的课程。'
                : 'Please purchase and activate the course on Taobao, or view your other purchased courses.'}
            </p>
          </div>

          <div className="space-y-3">
            <Link to="/activate" className="btn-primary w-full inline-block">
              {i18n.language === 'zh' ? '去激活课程' : 'Activate Course'}
            </Link>
            <Link to="/my-courses" className="btn-outline w-full inline-block">
              {i18n.language === 'zh' ? '我的课程' : 'My Courses'}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // User has access - render protected content
  return children
}

export default ProtectedRoute
