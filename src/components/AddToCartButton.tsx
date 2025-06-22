'use client'

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { toast } from "sonner"
import { useCartStore, Product } from "@/stores/cart-store"

interface AddToCartButtonProps {
  product: Product
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addToCart = useCartStore(state => state.addToCart)

  const handleAddToCart = () => {
    addToCart(product)
    toast.success(`${product.name} successfully added to cart!`)
  }

  return (
    <Button 
      onClick={handleAddToCart}
      size="sm"
      className="w-full h-8 bg-green-600 hover:bg-green-700 text-white text-xs"
    >
      <ShoppingCart className="w-3 h-3 mr-1" />
      Add to cart
    </Button>
  )
} 