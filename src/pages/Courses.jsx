import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { courses } from '../data/courses'
import Card from '../components/common/Card'

function Courses() {
  const { t, i18n } = useTranslation()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="gradient-bg py-16">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            {t('courses.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
            {t('courses.subtitle')}
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => {
              const title = i18n.language === 'zh' ? course.title : course.titleEn
              const description = i18n.language === 'zh' ? course.description : course.descriptionEn
              const duration = i18n.language === 'zh' ? course.duration : course.durationEn
              const sessions = i18n.language === 'zh' ? course.sessions : course.sessionsEn
              const highlights = i18n.language === 'zh' ? course.highlights : course.highlightsEn

              return (
                <Card key={course.id}>
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    {course.image && (
                      <img
                        src={course.image}
                        alt={title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs bg-cream text-primary px-3 py-1 rounded-full font-medium">
                        {t(`courses.difficulty.${course.difficulty}`)}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-600 mb-4">{description}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div>
                        <span className="font-medium">{t('courses.duration')}:</span> {duration}
                      </div>
                      <div>
                        {sessions}
                      </div>
                    </div>

                    <div className="mb-4">
                      <ul className="space-y-1">
                        {highlights.map((highlight, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start">
                            <span className="text-primary mr-2">•</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className="text-2xl font-bold text-primary">
                        ¥{course.price}
                      </span>
                      {course.courseId ? (
                        <Link
                          to={`/courses/${course.courseId}`}
                          className="bg-primary text-white px-8 py-2.5 rounded-full hover:bg-opacity-90 hover:shadow-lg transition-all font-medium"
                        >
                          {i18n.language === 'zh' ? '进入课程' : 'Enter Course'}
                        </Link>
                      ) : (
                        <button className="bg-primary text-white px-8 py-2.5 rounded-full hover:bg-opacity-90 hover:shadow-lg transition-all font-medium">
                          {t('courses.enroll')}
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Courses
