'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'

export function NavbarCart() {
  const [isMounted, setIsMounted] = useState(false)
  const items = useCartStore(state => state.items)

  // Calculate total quantity of all items in cart
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <Link href="/cart">
      <Button variant="ghost" size="sm" className="relative">
        <ShoppingCart className="h-4 w-4" />
        <span className="ml-2">
          {isMounted ? totalItems : 0}
        </span>
      </Button>
    </Link>
  )
} 