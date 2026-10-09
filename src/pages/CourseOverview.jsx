import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { courseMap } from '../data/courses/index'
import useAuthStore from '../store/authStore'
import CourseLessonList from '../components/courses/CourseLessonList'
import WovenBraceletLanding from '../components/courses/WovenBraceletLanding'

function CourseOverview() {
  const { courseId } = useParams()
  const { i18n } = useTranslation()
  const zh = i18n.language === 'zh'

  const course = courseMap[courseId]

  const { isLoggedIn, token } = useAuthStore()
  const [hasAccess, setHasAccess] = useState(false)
  const [kicked, setKicked] = useState(false)
  const [checking, setChecking] = useState(false)

  // 本页公开可访问,权限在页面内部判断:没有权限就降级成预览版,而不是把人挡在门外。
  useEffect(() => {
    if (!isLoggedIn || !token) {
      setHasAccess(false)
      setKicked(false)
      return
    }

    let active = true
    const controller = new AbortController()
    setChecking(true)

    fetch(`/api/check-course-access?courseId=${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((data) => {
        if (!active) return
        setKicked(!!data.kicked)
        setHasAccess(!!data.hasAccess)
      })
      .catch(() => {
        // 静默降级为预览版,不用报错打断浏览
      })
      .finally(() => {
        if (active) setChecking(false)
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [courseId, isLoggedIn, token])

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{zh ? '课程不存在' : 'Course not found'}</p>
      </div>
    )
  }

  // 有 landing 的课程(目前只有梭织手链)走设计稿专属版式。
  if (course.landing) {
    return (
      <WovenBraceletLanding
        course={course}
        courseId={courseId}
        zh={zh}
        hasAccess={hasAccess}
        kicked={kicked}
        checking={checking}
      />
    )
  }

  const total = course.lessons.length
  const title = zh ? course.title : course.titleEn
  const description = zh ? course.description : course.descriptionEn

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={course.coverImage}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-end">
          <div className="container-custom pb-8 text-white">
            <p className="text-sm uppercase tracking-wider mb-2 opacity-80">
              {zh ? course.difficulty : course.difficultyEn} · {zh ? course.duration : course.durationEn} · {total}{zh ? ' 节课' : ' lessons'}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
          </div>
        </div>
      </div>

      <div className="container-custom section-padding">
        {/* Description */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
          <p className="text-gray-700 leading-relaxed text-lg">{description}</p>
        </div>

        {/* 介绍图与作品图是给还没开通的人看的卖点素材。
            已开通用户直奔课程目录即可,不用再滚过一屏推销内容。 */}
        {!hasAccess && course.introImages?.length > 0 && (
          <div className="flex flex-col gap-3 mb-4">
            {course.introImages.map((src, i) => (
              <div key={i} className="rounded-lg overflow-hidden">
                <img src={src} alt="" className="w-full h-auto" loading="lazy" />
              </div>
            ))}
          </div>
        )}

        {!hasAccess && course.galleryImages?.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {course.galleryImages.map((src, i) => (
              <div key={i} className="rounded-lg overflow-hidden aspect-square">
                <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        )}

        {/* 被踢下线的用户其实拥有课程,不能让他看到「去激活」而困惑 */}
        {kicked && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <p className="text-amber-900">
              {zh
                ? '登录状态已失效。同一账号最多可在 2 台设备上使用，请重新登录后继续学习。'
                : 'Your session has expired. An account can stay signed in on up to 2 devices. Please sign in again to continue.'}
            </p>
            <Link to="/login?redirect=/my-courses" className="btn-primary inline-block mt-4">
              {zh ? '重新登录' : 'Sign in again'}
            </Link>
          </div>
        )}

        {/* Lesson List */}
        <CourseLessonList
          courseId={courseId}
          lessons={course.lessons}
          hasAccess={hasAccess}
          kicked={kicked}
          checking={checking}
          zh={zh}
        />
      </div>
    </div>
  )
}

export default CourseOverview
