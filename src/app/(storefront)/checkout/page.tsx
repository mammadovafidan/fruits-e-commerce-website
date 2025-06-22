'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/stores/cart-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { placeOrder } from './actions'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart } = useCartStore()
  const [isMounted, setIsMounted] = useState(false)

  // Set mounted state when component mounts on client
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Redirect to homepage if cart is empty (only after hydration)
  useEffect(() => {
    if (isMounted && items.length === 0) {
      router.push('/')
    }
  }, [isMounted, items.length, router])

  // Calculate total price
  const totalPrice = items.reduce((total, item) => {
    return total + (item.product.price_per_kg * item.quantity)
  }, 0)

  // Client-side action handler
  const handlePlaceOrder = async (formData: FormData) => {
    try {
      const result = await placeOrder(formData)

      if (result.success) {
        // Clear the cart and redirect to success page
        clearCart()
        toast.success('Your order has been successfully created!')
        router.push('/order-success')
      } else {
        // Show error message
        toast.error(`Order error: ${result.error}`)
      }
    } catch (error) {
      console.error('Order submission error:', error)
      toast.error('An unexpected error occurred. Please try again.')
    }
  }

  // Show loading state while waiting for hydration
  if (!isMounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-200 rounded-lg h-64"></div>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-200 rounded-lg h-64"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Don't render anything while redirecting (after hydration)
  if (isMounted && items.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Payment and Delivery</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} kg × ${item.product.price_per_kg.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${(item.product.price_per_kg * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}

              <Separator />

              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Total & Confirmation */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Complete Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Total Display */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center text-2xl font-bold">
                  <span>Amount to be paid: </span>
                  <span className="text-primary">${totalPrice.toFixed(2)}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  VAT included
                </p>
              </div>

              {/* Order Confirmation Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const form = e.currentTarget
                  const formData = new FormData(form)

                  const cardNumber = formData.get('cardNumber')?.toString().trim() || ''
                  const expiry = formData.get('cardExpiry')?.toString().trim() || ''
                  const cvc = formData.get('cardCVC')?.toString().trim() || ''

                  // Card number validation
                  if (!/^\d{16}$/.test(cardNumber)) {
                    toast.error('Card number must be exactly 16 digits.')
                    return
                  }

                  // Expiry format validation (MM/YY)
                  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
                    toast.error('Expiration date must be in MM/YY format.')
                    return
                  }

                  // CVC validation
                  if (!/^\d{3}$/.test(cvc)) {
                    toast.error('CVC must be exactly 3 digits.')
                    return
                  }

                  // All good → Submit
                  handlePlaceOrder(formData)
                }}
                className="space-y-4"
              >
                {/* Hidden input to send cart items to server */}
                <input
                  type="hidden"
                  name="cartItems"
                  value={JSON.stringify(items)}
                />

                {/* Personal Information */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input name="fullName" required placeholder="Full Name" />
                    <Input name="email" required type="email" placeholder="Email Address" />
                  </div>
                  <Input name="location" required placeholder="Location / Address" />
                </div>

                {/* Card Information */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Card Information</h3>
                  <Input name="cardName" required placeholder="Cardholder Name" />
                  <Input
                    name="cardNumber"
                    required
                    type="text"
                    placeholder="Card Number"
                    maxLength={16}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      name="cardExpiry"
                      required
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                    <Input
                      name="cardCVC"
                      required
                      type="text"
                      placeholder="CVC"
                      maxLength={3}
                    />
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Click the button below to confirm your order.</p>
                  <p>Payment and delivery information will be received in the next step.</p>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-lg py-6"
                >
                  Confirm and Complete Order
                </Button>
              </form>


              {/* Additional Info */}
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Your order will be ready within 24 hours</p>
                <p>• Free delivery (minimum 50$)</p>
                <p>• Return guarantee available</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 