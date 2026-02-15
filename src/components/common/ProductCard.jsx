import { useTranslation } from 'react-i18next'
import { HiShoppingCart } from 'react-icons/hi'
import useCartStore from '../../store/cartStore'
import Card from './Card'

function ProductCard({ product }) {
  const { i18n, t } = useTranslation()
  const addItem = useCartStore((state) => state.addItem)

  const name = i18n.language === 'zh' ? product.name : product.nameEn
  const description = i18n.language === 'zh' ? product.description : product.descriptionEn

  const handleAddToCart = () => {
    addItem(product)
    useCartStore.setState({ isDrawerOpen: true })
  }

  return (
    <Card>
      {/* Image */}
      <div className="aspect-square bg-gray-200 overflow-hidden">
        {product.image && (
          <img
            src={product.image}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
          {name}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">
            ¥{product.price}
          </div>
          <button
            onClick={handleAddToCart}
            className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all"
          >
            <HiShoppingCart size={18} />
            <span className="text-sm">{t('tools.addToCart')}</span>
          </button>
        </div>

        {product.stock !== undefined && product.stock < 10 && (
          <div className="mt-2 text-xs text-orange-600">
            {i18n.language === 'zh' ? `仅剩 ${product.stock} 件` : `Only ${product.stock} left`}
          </div>
        )}
      </div>
    </Card>
  )
}

export default ProductCard
