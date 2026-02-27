import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HiArrowLeft, HiArrowRight, HiCheckCircle, HiCheck } from 'react-icons/hi'
import { course1Data } from '../data/courses/course1'
import ContentRenderer from '../components/resources/ContentRenderer'
import useProgressStore from '../store/progressStore'

const courseMap = {
  course1: course1Data,
}

function LessonDetail() {
  const { courseId, lessonIndex } = useParams()
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const zh = i18n.language === 'zh'

  const course = courseMap[courseId]
  const index = parseInt(lessonIndex, 10)

  const isComplete = useProgressStore((s) => s.isComplete)
  const markComplete = useProgressStore((s) => s.markComplete)
  const markIncomplete = useProgressStore((s) => s.markIncomplete)

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{zh ? '课程不存在' : 'Course not found'}</p>
      </div>
    )
  }

  const lesson = course.lessons[index]

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{zh ? '章节不存在' : 'Lesson not found'}</p>
      </div>
    )
  }

  const done = isComplete(courseId, index)
  const hasPrev = index > 0
  const hasNext = index < course.lessons.length - 1
  const lessonTitle = zh ? lesson.title : lesson.titleEn
  const courseTitle = zh ? course.title : course.titleEn

  const handleToggleComplete = () => {
    if (done) {
      markIncomplete(courseId, index)
    } else {
      markComplete(courseId, index)
    }
  }

  const handleNext = () => {
    if (!done) markComplete(courseId, index)
    navigate(`/courses/${courseId}/lessons/${index + 1}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-4 flex items-center gap-3">
          <Link
            to={`/courses/${courseId}`}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors"
          >
            <HiArrowLeft className="w-4 h-4" />
            {zh ? '返回课程目录' : 'Back to course'}
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-700 font-medium truncate">{courseTitle}</span>
        </div>
      </div>

      <div className="container-custom py-8 max-w-3xl">
        {/* Lesson header */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-1">
            {zh
              ? `第 ${index + 1} 节 / 共 ${course.lessons.length} 节`
              : `Lesson ${index + 1} of ${course.lessons.length}`}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{lessonTitle}</h1>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-soft p-6 md:p-8 mb-8">
          <ContentRenderer blocks={lesson.contentBlocks} />
        </div>

        {/* Bottom navigation */}
        <div className="flex items-center justify-between gap-4">
          {/* Previous */}
          <div className="flex-1">
            {hasPrev && (
              <Link
                to={`/courses/${courseId}/lessons/${index - 1}`}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
              >
                <HiArrowLeft className="w-4 h-4" />
                <span>{zh ? '上一节' : 'Previous'}</span>
              </Link>
            )}
          </div>

          {/* Complete toggle */}
          <button
            onClick={handleToggleComplete}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
              done
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-primary text-white hover:bg-opacity-90'
            }`}
          >
            {done ? (
              <>
                <HiCheckCircle className="w-4 h-4" />
                {zh ? '已完成' : 'Completed'}
              </>
            ) : (
              <>
                <HiCheck className="w-4 h-4" />
                {zh ? '标记为已完成' : 'Mark complete'}
              </>
            )}
          </button>

          {/* Next */}
          <div className="flex-1 flex justify-end">
            {hasNext && (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
              >
                <span>{zh ? '下一节' : 'Next'}</span>
                <HiArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LessonDetail
