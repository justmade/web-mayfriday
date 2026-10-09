import { Link } from 'react-router-dom'
import { HiCheckCircle, HiChevronRight, HiLockClosed } from 'react-icons/hi'
import useProgressStore from '../../store/progressStore'

/**
 * 课程目录 + 进度 + 锁态 + 开通引导。
 *
 * 从 CourseOverview 抽出,供通用版式和梭织手链专属落地页共用,
 * 保证两边的权限/进度表现完全一致。
 *
 * variant: 'card'(默认,白底卡片,用于灰底页面) | 'plain'(无卡片外壳,用于白底落地页)
 */
function CourseLessonList({ courseId, lessons, hasAccess, kicked, checking, zh, variant = 'card' }) {
  const isComplete = useProgressStore((s) => s.isComplete)
  const getProgress = useProgressStore((s) => s.getProgress)

  const { completed, total } = getProgress(courseId, lessons.length)
  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0

  const shell =
    variant === 'card' ? 'bg-white rounded-xl shadow-soft p-6' : ''

  return (
    <div className={shell}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {zh ? '课程目录' : 'Course Contents'}
        </h2>
        <span className="text-sm text-gray-500">
          {zh ? `进度：${completed}/${total}` : `Progress: ${completed}/${total}`}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <ol className="space-y-2">
        {lessons.map((lesson) => {
          const lessonTitle = zh ? lesson.title : lesson.titleEn

          if (!hasAccess) {
            return (
              <li key={lesson.index}>
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50 cursor-default">
                  <span className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0 text-xs flex items-center justify-center text-gray-400">
                    {lesson.index + 1}
                  </span>
                  <span className="flex-1 text-sm md:text-base text-gray-500">
                    {lesson.index + 1}. {lessonTitle}
                  </span>
                  <HiLockClosed className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>
              </li>
            )
          }

          const done = isComplete(courseId, lesson.index)
          return (
            <li key={lesson.index}>
              <Link
                to={`/courses/${courseId}/lessons/${lesson.index}`}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  done ? 'bg-green-50 hover:bg-green-100' : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {done ? (
                  <HiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <span className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0 text-xs flex items-center justify-center text-gray-400">
                    {lesson.index + 1}
                  </span>
                )}
                <span className={`flex-1 text-sm md:text-base ${done ? 'text-green-800' : 'text-gray-700'}`}>
                  {lesson.index + 1}. {lessonTitle}
                </span>
                <HiChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </Link>
            </li>
          )
        })}
      </ol>

      {/* 预览版底部的开通引导。checking 期间不显示,避免已购用户看到一闪而过的「去激活」 */}
      {!hasAccess && !kicked && !checking && (
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 mb-4">
            {zh
              ? '以上为课程目录预览，开通后即可观看全部内容。'
              : 'This is a preview of the course outline. Unlock to watch all lessons.'}
          </p>
          <Link to="/activate" className="btn-primary inline-flex items-center gap-2">
            <HiLockClosed /> {zh ? '去激活' : 'Activate'}
          </Link>
          <p className="text-xs text-gray-500 mt-3">
            {zh
              ? '在淘宝购买课程后，用激活码开通'
              : 'Purchase on Taobao, then unlock with your activation code'}
          </p>
        </div>
      )}
    </div>
  )
}

export default CourseLessonList
