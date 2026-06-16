import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { products as fallbackProducts, categories as fallbackCategories } from '../data/products'
import ProductCard from '../components/common/ProductCard'
import { HiAdjustments, HiCheckCircle, HiSearch, HiShoppingBag } from 'react-icons/hi'

function Tools() {
  const { t, i18n } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState(fallbackProducts)
  const [categories, setCategories] = useState(fallbackCategories)
  const zh = i18n.language === 'zh'

  useEffect(() => {
    let active = true

    fetch('/api/products')
      .then((response) => response.json())
      .then((data) => {
        if (!active || !data.success) return
        setProducts(data.products)
        setCategories(data.categories)
      })
      .catch(() => {
        if (!active) return
        setProducts(fallbackProducts)
        setCategories(fallbackCategories)
      })

    return () => { active = false }
  }, [])

  const filteredProducts = useMemo(() => products.filter((product) => {
    const categoryMatches = selectedCategory === 'all' || product.category === selectedCategory
    const searchTarget = `${product.name} ${product.nameEn} ${product.description} ${product.descriptionEn}`.toLowerCase()
    return categoryMatches && searchTarget.includes(query.trim().toLowerCase())
  }), [products, selectedCategory, query])

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white border-b border-gray-200">
        <div className="container-custom px-4 md:px-8 lg:px-16 py-10 md:py-14">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-primary mb-2">
              {zh ? 'MAYIN FRIDAY 编织工具' : 'MAYIN FRIDAY WEAVING TOOLS'}
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('tools.title')}
            </h1>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              {zh
                ? '为卡织、排织与萨米提花挑选经过课程验证的工具。选择规格后加入购物车，提交订单由客服确认库存与付款。'
                : 'Course-tested tools for tablet, Inkle, and Sámi band weaving. Configure your tools, add them to cart, and submit an order for stock and payment confirmation.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200">
            {[
              [HiAdjustments, '支持规格配置', 'Configurable options'],
              [HiCheckCircle, '课程同款工具', 'Course-tested tools'],
              [HiShoppingBag, '客服确认发货', 'Confirmed before shipping'],
            ].map(([Icon, cn, en]) => (
              <div key={cn} className="flex items-center gap-3 text-sm text-gray-700">
                <Icon className="text-primary w-5 h-5" />
                <span>{zh ? cn : en}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sticky top-[76px] z-30 bg-white border-b border-gray-200">
        <div className="container-custom px-4 md:px-8 lg:px-16 py-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
            {categories.map((category) => {
              const name = zh ? category.name : category.nameEn

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 text-sm font-medium whitespace-nowrap border transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-gray-700 hover:border-gray-400 border-gray-200'
                  }`}
                >
                  {name}
                </button>
              )
            })}
          </div>
          <label className="relative block md:w-72">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={zh ? '搜索工具' : 'Search tools'}
              className="w-full h-10 pl-10 pr-3 border border-gray-200 focus:border-primary focus:outline-none text-sm"
            />
          </label>
        </div>
      </section>

      <section className="px-4 md:px-8 lg:px-16 py-10 md:py-14">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-xl text-gray-900">
              {zh ? '可选工具' : 'Available tools'}
            </h2>
            <span className="text-sm text-gray-500">{filteredProducts.length} {zh ? '件商品' : 'products'}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
