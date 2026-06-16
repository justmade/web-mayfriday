import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      addItem: (product) => {
        const items = get().items
        const cartItemId = product.cartItemId || String(product.id)
        const existingItem = items.find(item => (item.cartItemId || String(item.id)) === cartItemId)

        if (existingItem) {
          set({
            items: items.map(item =>
              (item.cartItemId || String(item.id)) === cartItemId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          })
        } else {
          set({
            items: [...items, { ...product, quantity: 1 }],
          })
        }
      },

      removeItem: (cartItemId) => {
        set({
          items: get().items.filter(item => (item.cartItemId || String(item.id)) !== cartItemId),
        })
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId)
          return
        }

        set({
          items: get().items.map(item =>
            (item.cartItemId || String(item.id)) === cartItemId
              ? { ...item, quantity: Math.min(quantity, item.stock || quantity) }
              : item
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
      version: 2,
      migrate: (persistedState, version) => version < 2
        ? { ...persistedState, items: [] }
        : persistedState,
    }
  )
)

export default useCartStore
