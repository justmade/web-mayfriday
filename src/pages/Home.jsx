import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { courses } from '../data/courses'
import { patterns } from '../data/patterns'
import { articles } from '../data/resources'
import { membershipPlans } from '../data/membership'
import Card from '../components/common/Card'
import { HiAcademicCap, HiBookOpen, HiUserGroup, HiSparkles } from 'react-icons/hi'

function Home() {
  const { t, i18n } = useTranslation()

  const featuredCourses = courses.slice(0, 3)
  const featuredPatterns = patterns.slice(0, 4)
  const latestArticles = articles.slice(0, 3)
  const popularPlan = membershipPlans.find(plan => plan.popular)

  return (
    <div>
      {/* Hero Section */}
      <section className="gradient-bg section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                {t('home.hero.title')}
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-10 font-light leading-relaxed">
                {t('home.hero.subtitle')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/courses" className="btn-primary text-lg">
                  {i18n.language === 'zh' ? '浏览课程' : 'Browse Courses'}
                </Link>
                <Link to="/membership" className="btn-outline text-lg">
                  {i18n.language === 'zh' ? '成为会员' : 'Join Membership'}
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <HiAcademicCap className="text-primary" size={32} />
              </div>
              <h3 className="font-bold text-xl mb-2">
                {i18n.language === 'zh' ? '专业课程' : 'Professional Courses'}
              </h3>
              <p className="text-gray-600">
                {i18n.language === 'zh' ? '100+ 系统化编织课程' : '100+ systematic courses'}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <HiBookOpen className="text-secondary" size={32} />
              </div>
              <h3 className="font-bold text-xl mb-2">
                {i18n.language === 'zh' ? '丰富资源' : 'Rich Resources'}
              </h3>
              <p className="text-gray-600">
                {i18n.language === 'zh' ? '文章、教程、图案库' : 'Articles, tutorials, patterns'}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <HiUserGroup className="text-accent" size={32} />
              </div>
              <h3 className="font-bold text-xl mb-2">
                {i18n.language === 'zh' ? '活跃社区' : 'Active Community'}
              </h3>
              <p className="text-gray-600">
                {i18n.language === 'zh' ? '与编织爱好者交流' : 'Connect with enthusiasts'}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-4">
                <HiSparkles className="text-gold" size={32} />
              </div>
              <h3 className="font-bold text-xl mb-2">
                {i18n.language === 'zh' ? '会员福利' : 'Member Benefits'}
              </h3>
              <p className="text-gray-600">
                {i18n.language === 'zh' ? '专属折扣与特权' : 'Exclusive discounts & perks'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.featured.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {i18n.language === 'zh' ? '精心挑选的优质编织课程' : 'Carefully curated quality courses'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
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
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">¥{course.price}</span>
                      <Link
                        to="/courses"
                        className="text-primary hover:text-secondary font-medium"
                      >
                        {i18n.language === 'zh' ? '查看详情' : 'View Details'} →
                      </Link>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          <div className="text-center">
            <Link to="/courses" className="btn-secondary">
              {t('home.featured.viewAll')}
            </Link>
          </div>
        </div>
      </section>

      {/* Membership CTA */}
      {popularPlan && (
        <section className="section-padding bg-gradient-to-r from-primary to-secondary text-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {i18n.language === 'zh' ? '加入会员，解锁全部内容' : 'Join Membership, Unlock All Content'}
              </h2>
              <p className="text-xl mb-8 opacity-90">
                {i18n.language === 'zh'
                  ? '访问所有课程、图案和独家资源，享受会员专属折扣'
                  : 'Access all courses, patterns and exclusive resources with member discounts'}
              </p>
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold">100+</div>
                  <div className="opacity-90">{i18n.language === 'zh' ? '课程' : 'Courses'}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">50+</div>
                  <div className="opacity-90">{i18n.language === 'zh' ? '图案' : 'Patterns'}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">20%</div>
                  <div className="opacity-90">{i18n.language === 'zh' ? '会员折扣' : 'Discount'}</div>
                </div>
              </div>
              <Link
                to="/membership"
                className="inline-block px-12 py-4 bg-white text-primary rounded-full font-bold text-lg hover:shadow-2xl transition-all"
              >
                {i18n.language === 'zh' ? '查看会员计划' : 'View Plans'}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Patterns */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {i18n.language === 'zh' ? '热门图案' : 'Popular Patterns'}
            </h2>
            <p className="text-xl text-gray-600">
              {i18n.language === 'zh' ? '下载即用的专业编织图案' : 'Professional patterns ready to download'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {featuredPatterns.map((pattern) => {
              const name = i18n.language === 'zh' ? pattern.name : pattern.nameEn

              return (
                <Card key={pattern.id}>
                  <div className="aspect-[3/4] bg-gray-200 overflow-hidden">
                    {pattern.image && (
                      <img
                        src={pattern.image}
                        alt={name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{name}</h3>
                    <div className="text-primary font-bold">¥{pattern.price}</div>
                  </div>
                </Card>
              )
            })}
          </div>

          <div className="text-center">
            <Link to="/patterns" className="btn-secondary">
              {i18n.language === 'zh' ? '浏览所有图案' : 'Browse All Patterns'}
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Resources */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {i18n.language === 'zh' ? '最新资源' : 'Latest Resources'}
            </h2>
            <p className="text-xl text-gray-600">
              {i18n.language === 'zh' ? '学习技巧、教程和灵感' : 'Tips, tutorials and inspiration'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {latestArticles.map((article) => {
              const title = i18n.language === 'zh' ? article.title : article.titleEn
              const excerpt = i18n.language === 'zh' ? article.excerpt : article.excerptEn

              return (
                <Card key={article.id}>
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    {article.image && (
                      <img
                        src={article.image}
                        alt={title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
                    <Link
                      to="/resources"
                      className="text-primary hover:text-secondary font-medium"
                    >
                      {i18n.language === 'zh' ? '阅读更多' : 'Read More'} →
                    </Link>
                  </div>
                </Card>
              )
            })}
          </div>

          <div className="text-center">
            <Link to="/resources" className="btn-secondary">
              {i18n.language === 'zh' ? '查看所有资源' : 'View All Resources'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
