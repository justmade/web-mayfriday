import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { articles } from '../data/resources'
import { HiArrowLeft, HiClock, HiUser, HiCalendar, HiTag } from 'react-icons/hi'
import ContentRenderer from '../components/resources/ContentRenderer'
import Card from '../components/common/Card'

function ResourceDetail() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const article = articles.find(a => a.id === parseInt(id))

  // 如果文章不存在，显示404
  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {i18n.language === 'zh' ? '文章未找到' : 'Article Not Found'}
          </h1>
          <Link to="/resources" className="text-primary hover:text-secondary">
            <HiArrowLeft className="inline mr-2" />
            {i18n.language === 'zh' ? '返回资源列表' : 'Back to Resources'}
          </Link>
        </div>
      </div>
    )
  }

  // 获取双语内容
  const title = i18n.language === 'zh' ? article.title : article.titleEn
  const author = i18n.language === 'zh' ? article.author : article.authorEn
  const readTime = i18n.language === 'zh' ? article.readTime : article.readTimeEn
  const tags = i18n.language === 'zh' ? article.tags : article.tagsEn

  // 获取相关文章（同类别，排除当前文章）
  const relatedArticles = articles
    .filter(a => a.category === article.category && a.id !== article.id)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Cover Image */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden bg-gray-900">
        <img
          src={article.image}
          alt={title}
          className="w-full h-full object-cover opacity-60"
          onError={(e) => {
            e.target.style.display = 'none'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 text-white p-8 container-custom">
          <Link
            to="/resources"
            className="inline-flex items-center mb-4 hover:text-primary transition-colors"
          >
            <HiArrowLeft className="mr-2" size={20} />
            {i18n.language === 'zh' ? '返回资源列表' : 'Back to Resources'}
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{title}</h1>
        </div>
      </section>

      {/* Article Metadata */}
      <section className="bg-white border-b border-gray-200">
        <div className="container-custom py-6">
          <div className="flex flex-wrap gap-4 md:gap-6 text-gray-600">
            <div className="flex items-center">
              <HiUser className="mr-2 text-primary" size={20} />
              <span>{author}</span>
            </div>
            <div className="flex items-center">
              <HiCalendar className="mr-2 text-primary" size={20} />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center">
              <HiClock className="mr-2 text-primary" size={20} />
              <span>{readTime}</span>
            </div>
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex items-start gap-2 mt-4">
              <HiTag className="text-primary mt-1 flex-shrink-0" size={20} />
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-cream text-primary px-3 py-1 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Article Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-soft p-6 md:p-12">
            <ContentRenderer blocks={article.contentBlocks} />
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="section-padding bg-cream">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {i18n.language === 'zh' ? '相关文章' : 'Related Articles'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((relatedArticle) => {
                const relatedTitle = i18n.language === 'zh' ? relatedArticle.title : relatedArticle.titleEn
                const relatedExcerpt = i18n.language === 'zh' ? relatedArticle.excerpt : relatedArticle.excerptEn

                return (
                  <Card key={relatedArticle.id}>
                    <Link to={`/resources/${relatedArticle.id}`}>
                      <div className="aspect-video bg-gray-200 overflow-hidden">
                        {relatedArticle.image && (
                          <img
                            src={relatedArticle.image}
                            alt={relatedTitle}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.style.display = 'none'
                            }}
                          />
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 hover:text-primary transition-colors">
                          {relatedTitle}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{relatedExcerpt}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <HiClock className="mr-1" size={16} />
                          <span>{i18n.language === 'zh' ? relatedArticle.readTime : relatedArticle.readTimeEn}</span>
                        </div>
                      </div>
                    </Link>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default ResourceDetail
