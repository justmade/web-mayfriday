import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HiCheckCircle, HiChevronRight } from 'react-icons/hi'
import { course1Data } from '../data/courses/course1'
import useProgressStore from '../store/progressStore'

const courseMap = {
  course1: course1Data,
}

function CourseOverview() {
  const { courseId } = useParams()
  const { i18n } = useTranslation()
  const zh = i18n.language === 'zh'

  const course = courseMap[courseId]
  const isComplete = useProgressStore((s) => s.isComplete)
  const getProgress = useProgressStore((s) => s.getProgress)

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{zh ? '课程不存在' : 'Course not found'}</p>
      </div>
    )
  }

  const { completed, total } = getProgress(courseId, course.lessons.length)
  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0

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

        {/* Gallery */}
        {course.galleryImages?.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {course.galleryImages.map((src, i) => (
              <div key={i} className="rounded-lg overflow-hidden aspect-square">
                <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        )}

        {/* Progress + Lesson List */}
        <div className="bg-white rounded-xl shadow-soft p-6">
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

          {/* Lesson list */}
          <ol className="space-y-2">
            {course.lessons.map((lesson) => {
              const done = isComplete(courseId, lesson.index)
              const lessonTitle = zh ? lesson.title : lesson.titleEn
              return (
                <li key={lesson.index}>
                  <Link
                    to={`/courses/${courseId}/lessons/${lesson.index}`}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      done
                        ? 'bg-green-50 hover:bg-green-100'
                        : 'bg-gray-50 hover:bg-gray-100'
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
        </div>
      </div>
    </div>
  )
}

export default CourseOverview
