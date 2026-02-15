import { useTranslation } from 'react-i18next'
import { HiMinus, HiPlus, HiX } from 'react-icons/hi'
import useCartStore from '../../store/cartStore'

function CartItem({ item }) {
  const { i18n, t } = useTranslation()
  const { updateQuantity, removeItem } = useCartStore()

  const name = i18n.language === 'zh' ? item.name : item.nameEn

  return (
    <div className="flex gap-4 py-4 border-b border-gray-200">
      {/* Image */}
      <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
        {item.image && (
          <img
            src={item.image}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-900">{name}</h3>
          <button
            onClick={() => removeItem(item.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Remove item"
          >
            <HiX size={18} />
          </button>
        </div>

        <div className="flex justify-between items-center">
          {/* Quantity controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label="Decrease quantity"
            >
              <HiMinus size={14} />
            </button>
            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label="Increase quantity"
            >
              <HiPlus size={14} />
            </button>
          </div>

          {/* Price */}
          <div className="text-right">
            <div className="text-primary font-bold">
              ¥{item.price * item.quantity}
            </div>
            {item.quantity > 1 && (
              <div className="text-xs text-gray-500">
                ¥{item.price} × {item.quantity}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItem
