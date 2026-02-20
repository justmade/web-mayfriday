import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import useAuthStore from '../store/authStore'
import { courses } from '../data/courses'
import { HiClock, HiAcademicCap, HiArrowRight } from 'react-icons/hi'

/**
 * 我的课程页面
 * My Courses page - shows user's activated courses
 */
function MyCourses() {
  const [userCourses, setUserCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { token, isLoggedIn, logout } = useAuthStore()
  const { i18n } = useTranslation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    fetchUserCourses()
  }, [isLoggedIn])

  /**
   * 获取用户课程列表
   * Fetch user's courses from API
   */
  const fetchUserCourses = async () => {
    try {
      const res = await fetch('/api/get-user-courses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await res.json()

      if (data.kicked) {
        // User was kicked from another device
        logout()
        navigate('/login', {
          state: { message: i18n.language === 'zh' ? '您的账号已在其他设备登录' : 'Account logged in on another device' }
        })
        return
      }

      if (data.success) {
        // Match course IDs with course data
        const matchedCourses = data.courses
          .map(courseId => courses.find(c => c.id === courseId))
          .filter(Boolean)  // Remove any not found

        setUserCourses(matchedCourses)
      } else {
        setError(data.error)
      }
    } catch (err) {
      console.error('Fetch courses error:', err)
      setError(i18n.language === 'zh' ? '获取课程失败' : 'Failed to fetch courses')
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

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {i18n.language === 'zh' ? '出错了' : 'Error'}
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
          </div>

          <button onClick={fetchUserCourses} className="btn-primary w-full">
            {i18n.language === 'zh' ? '重试' : 'Retry'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white section-padding">
        <div className="container-custom">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {i18n.language === 'zh' ? '我的课程' : 'My Courses'}
              </h1>
              <p className="text-white/90">
                {i18n.language === 'zh'
                  ? `您已激活 ${userCourses.length} 个课程`
                  : `You have activated ${userCourses.length} course${userCourses.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <HiAcademicCap className="text-8xl opacity-20" />
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {userCourses.length === 0 ? (
            // Empty state
            <div className="text-center py-20">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <HiAcademicCap className="text-6xl text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {i18n.language === 'zh' ? '您还没有激活任何课程' : 'No Courses Activated Yet'}
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {i18n.language === 'zh'
                  ? '在淘宝购买课程后，使用激活码即可开始学习'
                  : 'Purchase a course on Taobao and activate it to start learning'}
              </p>

              <div className="flex gap-4 justify-center">
                <Link to="/activate" className="btn-primary">
                  {i18n.language === 'zh' ? '去激活课程' : 'Activate Course'}
                </Link>
                <Link to="/courses" className="btn-outline">
                  {i18n.language === 'zh' ? '浏览课程' : 'Browse Courses'}
                </Link>
              </div>
            </div>
          ) : (
            // Courses grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {userCourses.map((course) => {
                const title = i18n.language === 'zh' ? course.title : course.titleEn
                const description = i18n.language === 'zh' ? course.description : course.descriptionEn
                const duration = i18n.language === 'zh' ? course.duration : course.durationEn
                const sessions = i18n.language === 'zh' ? course.sessions : course.sessionsEn

                return (
                  <Link
                    key={course.id}
                    to={`/courses/${course.id}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-soft card-hover"
                  >
                    {/* Course Image */}
                    <div className="aspect-video bg-gray-200 overflow-hidden relative">
                      {course.image && (
                        <img
                          src={course.image}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      )}

                      {/* Difficulty Badge */}
                      <div className="absolute top-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          course.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                          course.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {i18n.language === 'zh'
                            ? course.difficulty === 'beginner' ? '初级' : course.difficulty === 'intermediate' ? '中级' : '高级'
                            : course.difficulty === 'beginner' ? 'Beginner' : course.difficulty === 'intermediate' ? 'Intermediate' : 'Advanced'}
                        </span>
                      </div>
                    </div>

                    {/* Course Info */}
                    <div className="p-6">
                      <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-primary transition-colors">
                        {title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {description}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <HiClock className="mr-1" size={16} />
                          <span>{duration}</span>
                        </div>
                        <div className="flex items-center">
                          <HiAcademicCap className="mr-1" size={16} />
                          <span>{sessions}</span>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform">
                        <span>{i18n.language === 'zh' ? '开始学习' : 'Start Learning'}</span>
                        <HiArrowRight className="ml-2" size={18} />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default MyCourses
