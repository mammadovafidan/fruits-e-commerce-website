'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Star,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Share2,
  ArrowLeft,
  Truck,
  Shield,
  RotateCcw
} from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { supabase } from '@/lib/supabase/client'
import ProductCard from '@/components/ProductCard'
import { AddToCartButton } from '@/components/AddToCartButton'
import { Product } from '@/stores/cart-store'

type ProductWithExtras = {
  id: number
  name: string
  description: string
  price_per_kg: number
  stock_kg: number
  image_url: string | null
  category_id: number
  categories?: {
    id: number
    name: string
  } | null
}

interface ProductPageProps {
  params: { id: string }
}

export default function ProductPage({ params: { id } }: ProductPageProps) {
  const router = useRouter()
  const [product, setProduct] = useState<ProductWithExtras | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<ProductWithExtras[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true)
        const productId = parseInt(id)

        if (isNaN(productId)) {
          router.push('/products')
          return
        }

        // Fetch the product
        const { data: productData, error: productError } = await supabase
          .from('fruits')
          .select('*, categories(id, name)')
          .eq('id', productId)
          .single()

        if (productError || !productData) {
          router.push('/products')
          return
        }

        setProduct(productData)

        // Fetch related products from the same category
        if (productData.category_id) {
          const { data: relatedData } = await supabase
            .from('fruits')
            .select('*, categories(id, name)')
            .eq('category_id', productData.category_id)
            .neq('id', productId)
            .limit(4)

          setRelatedProducts(relatedData || [])
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        router.push('/products')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, router])

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= (product?.stock_kg || 0)) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log(`Added ${quantity}kg of ${product?.name} to cart`)
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    // TODO: Implement wishlist functionality
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      })
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const leftColumnVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  const rightColumnVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image skeleton */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-md animate-pulse" />
              ))}
            </div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  // For demo purposes, create multiple image URLs (in real app, you'd have multiple images)
  const productImages = product.image_url
    ? [product.image_url, product.image_url, product.image_url, product.image_url]
    : []

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <Link href="/" className="hover:text-primary">Home Page</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">Products</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <Link
          href="/products"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Column - Images */}
        <motion.div variants={leftColumnVariants} className="space-y-4">
          {/* Main Image */}
          <motion.div
            className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {product.image_url ? (
              <Image
                src={productImages[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span>No Image</span>
              </div>
            )}
          </motion.div>

          {/* Thumbnail Images */}
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <motion.button
                  key={index}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 transition-colors ${selectedImage === index ? 'border-primary' : 'border-gray-200'
                    }`}
                  onClick={() => setSelectedImage(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right Column - Product Info */}
        <motion.div variants={rightColumnVariants} className="space-y-6">
          {/* Product Header */}
          <motion.div variants={itemVariants} className="space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="secondary">
                {product.categories?.name || 'Category'}
              </Badge>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleWishlist}
                  className={isWishlisted ? 'text-red-500' : ''}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <h1 className="text-3xl font-bold">{product.name}</h1>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-primary">
                ${product.price_per_kg.toFixed(2)}/kg
              </span>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-2">(4.2)</span>
              </div>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold mb-2">Product Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </motion.div>

          <Separator />

          {/* Quantity and Add to Cart */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Amount:</span>
              <span className="text-sm text-gray-600">
                Stock: {product.stock_kg} kg
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="rounded-r-none"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 font-medium min-w-[60px] text-center">
                  {quantity} kg
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock_kg}
                  className="rounded-l-none"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-xl font-bold">
                  ${(product.price_per_kg * quantity).toFixed(2)}
                </p>
              </div>
            </div>

            <AddToCartButton
              product={{
                id: product.id.toString(),
                name: product.name,
                image_url: product.image_url || '',
                price_per_kg: product.price_per_kg
              }}
            />
          </motion.div>

          <Separator />

          {/* Features */}
          <motion.div variants={itemVariants} className="space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <Truck className="h-5 w-5 text-green-600" />
              <span>
                Free shipping (for orders over 50$)</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Shield className="h-5 w-5 text-blue-600" />
              <span>Freshness guaranteed</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <RotateCcw className="h-5 w-5 text-orange-600" />
              <span>7-day return guarantee</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <motion.section
          className="mt-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-8">Similar Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct, index) => (
              <motion.div
                key={relatedProduct.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={relatedProduct} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  )
} 