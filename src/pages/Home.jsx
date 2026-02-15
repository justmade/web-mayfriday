import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { courses } from '../data/courses'
import { galleryItems } from '../data/gallery'
import Card from '../components/common/Card'

function Home() {
  const { t, i18n } = useTranslation()

  const featuredCourses = courses.slice(0, 3)
  const recentWorks = galleryItems.slice(0, 6)

  return (
    <div>
      {/* Hero Section */}
      <section className="gradient-bg section-padding">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            {t('home.hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto font-light">
            {t('home.hero.subtitle')}
          </p>
          <Link to="/courses" className="btn-primary inline-block text-lg">
            {t('home.hero.cta')}
          </Link>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.featured.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCourses.map((course) => {
              const title = i18n.language === 'zh' ? course.title : course.titleEn
              const description = i18n.language === 'zh' ? course.description : course.descriptionEn
              const duration = i18n.language === 'zh' ? course.duration : course.durationEn

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
                      <span className="text-xs text-gray-500">{duration}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        ¥{course.price}
                      </span>
                      <Link
                        to="/courses"
                        className="text-primary hover:text-secondary font-medium"
                      >
                        {t('common.viewDetails')} →
                      </Link>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <Link to="/courses" className="btn-secondary">
              {t('home.featured.viewAll')}
            </Link>
          </div>
        </div>
      </section>

      {/* About Studio */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {t('home.about.title')}
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              {t('home.about.description')}
            </p>
            <Link to="/studio" className="btn-primary">
              {t('home.about.learnMore')}
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Works */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.recent.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentWorks.map((item) => {
              const title = i18n.language === 'zh' ? item.title : item.titleEn

              return (
                <div
                  key={item.id}
                  className="group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
                >
                  <div className="aspect-square bg-gray-200 overflow-hidden">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <Link to="/gallery" className="btn-secondary">
              {t('home.recent.viewGallery')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
