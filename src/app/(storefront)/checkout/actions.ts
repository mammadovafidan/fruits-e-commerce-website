'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'

export async function placeOrder(formData: FormData) {
  try {
    // 1. Parse cart items from form data
    const cartItemsJson = formData.get('cartItems') as string
    if (!cartItemsJson) {
      return { success: false, error: 'Cart items not provided' }
    }

    let cartItems
    try {
      cartItems = JSON.parse(cartItemsJson)
    } catch (error) {
      return { success: false, error: 'Invalid cart data format' }
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return { success: false, error: 'Cart is empty' }
    }

    // 2. Authentication - Get current user
    const supabase = await createSupabaseServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'User not authenticated' }
    }

    // 3. Security - Get unique product IDs for server-side price verification
    const productIds = [...new Set(cartItems.map(item => Number(item.product.id)))]
    
    // Fetch actual product data from database
    const { data: products, error: productsError } = await supabase
      .from('fruits')
      .select('id, name, price_per_kg')
      .in('id', productIds)

    if (productsError) {
      return { success: false, error: 'Error verifying product information' }
    }

    if (!products || products.length !== productIds.length) {
      return { success: false, error: 'Some products are no longer available' }
    }

    // 4. Server-side price calculation using database prices
    let totalPrice = 0

    for (const cartItem of cartItems) {
      const dbProduct = products.find(p => p.id === Number(cartItem.product.id))
      if (!dbProduct) {
        return { success: false, error: `Product ${cartItem.product.name} not found` }
      }

      const itemTotal = dbProduct.price_per_kg * cartItem.quantity
      totalPrice += itemTotal
    }

    // 5. Database Insert - Create order
    const newOrder = {
      user_id: user.id,
      total_price: totalPrice,
      order_details: cartItems,
      status: 'pending'
    }

    const { error: insertError } = await supabase
      .from('orders')
      .insert([newOrder])

    if (insertError) {
      // Temporary debugging - log the actual error
      console.error('Database insert error:', insertError)
      console.error('Attempted to insert:', newOrder)
      return { success: false, error: `Database error: ${insertError.message}` }
    }

    // 6. Return success response
    return { success: true }

  } catch (error) {
    return { success: false, error: 'An unexpected error occurred' }
  }
}