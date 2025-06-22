import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Product type definition
export interface Product {
  id: string
  name: string
  image_url: string
  price_per_kg: number
}

// CartItem type definition
export interface CartItem {
  product: Product
  quantity: number
}

// CartState interface with items and actions
interface CartState {
  items: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, newQuantity: number) => void
  clearCart: () => void
}

// Create the cart store with persistence
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (product: Product) => {
        const { items } = get()
        const existingItem = items.find(item => item.product.id === product.id)
        
        if (existingItem) {
          // If product already exists, increment quantity
          set({
            items: items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          })
        } else {
          // If product doesn't exist, add it with quantity 1
          set({
            items: [...items, { product, quantity: 1 }]
          })
        }
      },
      
      removeFromCart: (productId: string) => {
        set({
          items: get().items.filter(item => item.product.id !== productId)
        })
      },
      
      updateQuantity: (productId: string, newQuantity: number) => {
        const { items } = get()
        
        if (newQuantity <= 0) {
          // Remove item if quantity is 0 or less
          set({
            items: items.filter(item => item.product.id !== productId)
          })
        } else {
          // Update quantity
          set({
            items: items.map(item =>
              item.product.id === productId
                ? { ...item, quantity: newQuantity }
                : item
            )
          })
        }
      },

      clearCart: () => {
        set({ items: [] })
      }
    }),
    {
      name: 'cart-storage'
    }
  )
)
