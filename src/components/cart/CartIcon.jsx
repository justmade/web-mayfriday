import { HiShoppingCart } from 'react-icons/hi'
import useCartStore from '../../store/cartStore'

function CartIcon() {
  const { getTotalItems, toggleDrawer } = useCartStore((state) => ({
    getTotalItems: state.getTotalItems,
    toggleDrawer: state.toggleDrawer,
  }))

  const totalItems = getTotalItems()

  return (
    <button
      onClick={() => useCartStore.setState({ isDrawerOpen: true })}
      className="relative p-2 text-gray-700 hover:text-primary transition-colors"
      aria-label="Shopping cart"
    >
      <HiShoppingCart size={24} />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems > 9 ? '9+' : totalItems}
        </span>
      )}
    </button>
  )
}

export default CartIcon
