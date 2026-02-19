import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { articles, resourceCategories } from '../data/resources'
import { Link } from 'react-router-dom'
import { HiClock, HiUser, HiTag } from 'react-icons/hi'

function Resources() {
  const { t, i18n } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredArticles = selectedCategory === 'all'
    ? articles
    : articles.filter(article => article.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="gradient-bg py-16">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            {i18n.language === 'zh' ? '学习资源' : 'Learning Resources'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
            {i18n.language === 'zh'
              ? '文章、教程、学习指南 - 丰富您的编织知识'
              : 'Articles, Tutorials, Study Guides - Enrich Your Weaving Knowledge'}
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="section-padding py-8 bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3 justify-center">
            {resourceCategories.map((category) => {
              const name = i18n.language === 'zh' ? category.name : category.nameEn

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-2.5 rounded-full font-medium transition-all shadow-sm ${
                    selectedCategory === category.id
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-cream border border-gray-200'
                  }`}
                >
                  {name}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => {
              const title = i18n.language === 'zh' ? article.title : article.titleEn
              const excerpt = i18n.language === 'zh' ? article.excerpt : article.excerptEn
              const author = i18n.language === 'zh' ? article.author : article.authorEn
              const readTime = i18n.language === 'zh' ? article.readTime : article.readTimeEn
              const tags = i18n.language === 'zh' ? article.tags : article.tagsEn

              return (
                <article
                  key={article.id}
                  className="bg-white rounded-xl shadow-soft overflow-hidden card-hover"
                >
                  {/* Image */}
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

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-primary transition-colors">
                      <Link to={`/resources/${article.slug}`}>{title}</Link>
                    </h2>

                    <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>

                    {/* Meta Info */}
                    <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                      <div className="flex items-center">
                        <HiUser className="mr-1" />
                        {author}
                      </div>
                      <div className="flex items-center">
                        <HiClock className="mr-1" />
                        {readTime}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-cream text-primary font-medium"
                        >
                          <HiTag className="mr-1" size={12} />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Read More Link */}
                    <Link
                      to={`/resources/${article.id}`}
                      className="inline-block mt-4 text-primary font-medium hover:text-secondary transition-colors"
                    >
                      {i18n.language === 'zh' ? '阅读全文' : 'Read More'} →
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                {i18n.language === 'zh' ? '该分类暂无资源' : 'No resources in this category'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Resources
