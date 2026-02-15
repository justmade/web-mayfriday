import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { galleryItems, galleryCategories } from '../data/gallery'
import ImageGallery from '../components/common/ImageGallery'

function Gallery() {
  const { t, i18n } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredItems = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="gradient-bg py-16">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            {t('gallery.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
            {t('gallery.subtitle')}
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="section-padding py-8 bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3 justify-center">
            {galleryCategories.map((category) => {
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

      {/* Gallery */}
      <section className="section-padding">
        <div className="container-custom">
          {filteredItems.length > 0 ? (
            <ImageGallery items={filteredItems} />
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                {i18n.language === 'zh' ? '该分类暂无作品' : 'No works in this category'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Gallery
