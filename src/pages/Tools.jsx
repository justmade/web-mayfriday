import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { products, categories } from '../data/products'
import ProductCard from '../components/common/ProductCard'

function Tools() {
  const { t, i18n } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-cream to-white section-padding py-12">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('tools.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('tools.subtitle')}
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="section-padding py-8 bg-white border-b border-gray-200">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => {
              const name = i18n.language === 'zh' ? category.name : category.nameEn

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {name}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                {i18n.language === 'zh' ? '该分类暂无商品' : 'No products in this category'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Tools
