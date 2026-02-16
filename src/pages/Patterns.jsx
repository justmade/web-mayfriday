import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { patterns, patternCategories, patternTypes, difficultyLevels } from '../data/patterns'
import { HiDownload, HiStar, HiShoppingCart } from 'react-icons/hi'
import useCartStore from '../store/cartStore'
import Card from '../components/common/Card'

function Patterns() {
  const { i18n } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const addItem = useCartStore((state) => state.addItem)

  const filteredPatterns = patterns.filter((pattern) => {
    const categoryMatch = selectedCategory === 'all' || pattern.category === selectedCategory
    const typeMatch = selectedType === 'all' || pattern.type === selectedType
    const difficultyMatch = selectedDifficulty === 'all' || pattern.difficulty === selectedDifficulty
    return categoryMatch && typeMatch && difficultyMatch
  })

  const handleAddToCart = (pattern) => {
    addItem(pattern)
    useCartStore.setState({ isDrawerOpen: true })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="gradient-bg py-16">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            {i18n.language === 'zh' ? '编织图案' : 'Weaving Patterns'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
            {i18n.language === 'zh'
              ? '专业编织图案，数字下载，即买即用'
              : 'Professional weaving patterns, digital download, instant access'}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="section-padding py-8 bg-white border-b border-gray-200">
        <div className="container-custom">
          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              {i18n.language === 'zh' ? '分类' : 'Category'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {patternCategories.map((category) => {
                const name = i18n.language === 'zh' ? category.name : category.nameEn
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
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

          {/* Type Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              {i18n.language === 'zh' ? '类型' : 'Type'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {patternTypes.map((type) => {
                const name = i18n.language === 'zh' ? type.name : type.nameEn
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedType === type.id
                        ? 'bg-secondary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              {i18n.language === 'zh' ? '难度' : 'Difficulty'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {difficultyLevels.map((level) => {
                const name = i18n.language === 'zh' ? level.name : level.nameEn
                return (
                  <button
                    key={level.id}
                    onClick={() => setSelectedDifficulty(level.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedDifficulty === level.id
                        ? 'bg-accent text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {name}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Patterns Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPatterns.map((pattern) => {
              const name = i18n.language === 'zh' ? pattern.name : pattern.nameEn
              const description = i18n.language === 'zh' ? pattern.description : pattern.descriptionEn

              return (
                <Card key={pattern.id}>
                  {/* Image */}
                  <div className="aspect-[3/4] bg-gray-200 overflow-hidden relative">
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
                    {/* Badge */}
                    <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-medium shadow-md">
                      {pattern.fileFormat}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                      {name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center">
                        <HiStar className="text-gold mr-1" />
                        <span>{pattern.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <HiDownload className="mr-1" />
                        <span>{pattern.downloads}</span>
                      </div>
                      <div>
                        {pattern.pages} {i18n.language === 'zh' ? '页' : 'pages'}
                      </div>
                    </div>

                    {/* Price and Add to Cart */}
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-primary">
                        ¥{pattern.price}
                      </div>
                      <button
                        onClick={() => handleAddToCart(pattern)}
                        className="flex items-center space-x-1 bg-primary text-white px-4 py-2 rounded-full hover:bg-opacity-90 hover:shadow-lg transition-all text-sm font-medium"
                      >
                        <HiShoppingCart size={16} />
                        <span>{i18n.language === 'zh' ? '购买' : 'Buy'}</span>
                      </button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          {filteredPatterns.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                {i18n.language === 'zh' ? '没有找到符合条件的图案' : 'No patterns match your filters'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Patterns
