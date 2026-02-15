import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { HiX } from 'react-icons/hi'
import useCartStore from '../../store/cartStore'
import CartItem from './CartItem'

function CartDrawer() {
  const { t } = useTranslation()
  const { items, isDrawerOpen, getTotalPrice } = useCartStore((state) => ({
    items: state.items,
    isDrawerOpen: state.isDrawerOpen,
    getTotalPrice: state.getTotalPrice,
  }))

  const closeDrawer = () => {
    useCartStore.setState({ isDrawerOpen: false })
  }

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isDrawerOpen])

  if (!isDrawerOpen) return null

  const totalPrice = getTotalPrice()

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{t('tools.cart')}</h2>
          <button
            onClick={closeDrawer}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close cart"
          >
            <HiX size={24} />
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-grow overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p>{t('tools.emptyCart')}</p>
            </div>
          ) : (
            <div>
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium text-gray-900">
                {t('tools.total')}
              </span>
              <span className="text-2xl font-bold text-primary">
                ¥{totalPrice}
              </span>
            </div>
            <button className="btn-primary w-full">
              {t('tools.checkout')}
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default CartDrawer
