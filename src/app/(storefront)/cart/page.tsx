'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Minus, Plus, Trash2, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'

export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false)
  const { items, updateQuantity, removeFromCart } = useCartStore()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Calculate total price
  const totalPrice = items.reduce((total, item) => {
    return total + (item.product.price_per_kg * item.quantity)
  }, 0)

  // Show loading state until hydrated
  if (!isMounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <ShoppingCart className="h-24 w-24 text-gray-400 mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 mb-8 max-w-md">
                        You have not added any products to your cart yet. 
                        Visit the products page to discover our fresh and delicious fruits.
          </p>
          <Link href="/products">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Keep Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Basket</h1>
        <p className="text-gray-600">
          {items.length} product in your cart
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Products in your cart</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => (
                <div key={item.product.id}>
                  <div className="flex items-center space-x-4 py-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 relative rounded-lg overflow-hidden bg-gray-100">
                        {item.product.image_url ? (
                          <Image
                            src={item.product.image_url}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ShoppingCart className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        ${item.product.price_per_kg.toFixed(2)}/kg
                      </p>
                      <p className="text-sm font-medium text-green-600">
                        Total: ${(item.product.price_per_kg * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      
                      <span className="w-12 text-center font-medium">
                        {item.quantity} kg
                      </span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Separator between items */}
                  {index < items.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Continue Shopping Link */}
          <div className="mt-6">
            <Link href="/products">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Keep Shopping
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items Summary */}
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product.name} × {item.quantity}kg
                    </span>
                    <span>${(item.product.price_per_kg * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Total Calculation */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Cargo</span>
                  <span className="text-green-600">
                    {totalPrice >= 50 ? 'Free of charge' : '$5.00'}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${(totalPrice + (totalPrice >= 50 ? 0 : 5)).toFixed(2)}</span>
                </div>
              </div>

              {/* Free Shipping Notice */}
              {totalPrice < 50 && (
                <div className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg">
                  ${(50 - totalPrice).toFixed(2)} spend more and get free shipping!
                </div>
              )}

              {/* Checkout Button */}
              <Link href="/checkout">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  Go to Payment
                </Button>
              </Link>

              {/* Security Notice */}
              <p className="text-xs text-gray-500 text-center">
                Secure payment and 7-day return guarantee
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
