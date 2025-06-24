'use client'

import { motion } from 'framer-motion'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
// import Image from 'next/image'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'
import ProductCard from '@/components/ProductCard'
import { 
  ShoppingCart, 
  Leaf, 
  Truck, 
  Award, 
  Star, 
  ArrowRight, 
  Zap,
  Shield,
  Heart,
  Users,
  TrendingUp,
  MapPin,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

type Product = {
  id: number
  name: string
  price_per_kg: number
  image_url: string | null
  categories?: {
    name: string
  } | null
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const { data, error } = await supabase
          .from('fruits')
          .select('*, categories(name)')
          .order('created_at', { ascending: false })
          .limit(12)

        if (error) throw error
        setFeaturedProducts(data || [])
      } catch (error) {
        console.error('Error fetching featured products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  // Carousel functionality
  const itemsPerSlide = 4
  const totalSlides = Math.ceil(featuredProducts.length / itemsPerSlide)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }, [totalSlides])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }, [totalSlides])

  // Auto-slide functionality
  useEffect(() => {
    if (featuredProducts.length === 0) return
    
    const interval = setInterval(nextSlide, 5000) // Change slide every 5 seconds
    return () => clearInterval(interval)
  }, [nextSlide, featuredProducts.length])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-orange-50">
        {/* Floating Elements */}
        <motion.div 
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full opacity-20 blur-xl"
          animate={floatingAnimation}
        />
        <motion.div 
          className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-20 blur-xl"
          animate={{
            ...floatingAnimation,
            transition: { ...floatingAnimation.transition, delay: 1 }
          }}
        />
        <motion.div 
          className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl"
          animate={{
            ...floatingAnimation,
            transition: { ...floatingAnimation.transition, delay: 2 }
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 mb-8 shadow-lg"
              variants={itemVariants}
            >
              <Leaf className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">100% Organic and Natural</span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-tight"
              variants={itemVariants}
            >
              The Freshest Form of 
              <br />
              <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Naturalness
              </span>
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              On the journey from the farmer to your table, we bring
              <span className="text-green-600 font-semibold"> the freshest and highest quality fruits  </span>to your door with a single click.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
              variants={itemVariants}
            >
              <Link 
                href="/products" 
                className={buttonVariants({ 
                  size: "lg", 
                  className: "text-lg px-8 py-4 h-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
                })}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/products" 
                className={buttonVariants({ 
                  variant: "outline", 
                  size: "lg",
                  className: "text-lg px-8 py-4 h-auto border-2 hover:bg-gray-50 backdrop-blur-sm" 
                })}
              >
                Explore Products
              </Link>
            </motion.div>

            {/* Hero Stats */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
              variants={containerVariants}
            >
              {[
                { icon: Users, label: "Happy Customer", value: "10,000+" },
                { icon: Truck, label: "Successful Delivery", value: "50,000+" },
                { icon: Award, label: "Quality Score", value: "4.9/5" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg"
                  variants={itemVariants}
                >
                  <stat.icon className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full mb-6">
              <TrendingUp className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-800">Popular Products</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Most Favorite Fruits</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our fresh and delicious fruits, the most preferred by our customers
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden border-0 shadow-lg">
                  <div className="aspect-square bg-gray-200 animate-pulse" />
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-3">
                      <div className="h-6 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
                      <div className="h-10 bg-gray-200 rounded w-24 animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="relative">
              {/* Carousel Container */}
              <div className="overflow-hidden rounded-3xl">
                <motion.div
                  className="flex"
                  animate={{
                    x: `-${currentSlide * 100}%`
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                >
                  {Array.from({ length: totalSlides }, (_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
                        {featuredProducts
                          .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                          .map((product, index) => (
                            <motion.div
                              key={product.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ y: -5 }}
                            >
                              <ProductCard product={product} />
                            </motion.div>
                          ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Navigation Arrows */}
              {totalSlides > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-gray-600 hover:text-green-600 hover:scale-110 z-10"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-gray-600 hover:text-green-600 hover:scale-110 z-10"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Carousel Dots */}
              {totalSlides > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  {Array.from({ length: totalSlides }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentSlide
                          ? 'bg-green-600 shadow-lg scale-110'
                          : 'bg-gray-300 hover:bg-green-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {featuredProducts.length > 0 && (
            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Link 
                href="/products" 
                className={buttonVariants({ 
                  variant: "outline", 
                  size: "lg",
                  className: "text-lg px-8 py-4 h-auto border-2 hover:bg-green-50 hover:border-green-300" 
                })}
              >
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          )}

          {featuredProducts.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="mb-6">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Product Available Yet</h3>
              <p className="text-gray-600 mb-8">Start building your store by adding the first product.</p>
              <Link href="/admin/products/new" className={buttonVariants({ size: "lg" })}>
                Add First Product
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Why Choose Us?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make a difference with our service approach focused on quality, trust and customer satisfaction
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Leaf,
                title: "100% Organic",
                description: "Completely natural products without chemical fertilizers and pesticides",
                color: "green"
              },
              {
                icon: Zap,
                title: "Same Day Delivery",
                description: "We deliver your order to your door on the same day",
                color: "blue"
              },
              {
                icon: Shield,
                title: "Quality Guarantee",
                description: "We offer a 100% money back guarantee if you are not satisfied",
                color: "orange"
              },
              {
                icon: Heart,
                title: "Customer Oriented",
                description: "24/7 customer support and personalized service",
                color: "purple"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
                  feature.color === 'green' ? 'bg-green-100 group-hover:bg-green-200' :
                  feature.color === 'blue' ? 'bg-blue-100 group-hover:bg-blue-200' :
                  feature.color === 'orange' ? 'bg-orange-100 group-hover:bg-orange-200' :
                  'bg-purple-100 group-hover:bg-purple-200'
                }`}>
                  <feature.icon className={`w-8 h-8 ${
                    feature.color === 'green' ? 'text-green-600' :
                    feature.color === 'blue' ? 'text-blue-600' :
                    feature.color === 'orange' ? 'text-orange-600' :
                    'text-purple-600'
                  }`} />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">What Our Customers Say?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real reviews from thousands of happy customers
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                name: "Ayşe Demir",
                location: "İstanbul",
                rating: 5,
                comment: "The fruit came really fresh. Especially the apples taste great! I will definitely order again."
              },
              {
                name: "Mehmet Kaya",
                location: "Ankara",
                rating: 5,
                comment: "Same day delivery is really fast. The quality is also much better than I expected. Thank you!"
              },
              {
                name: "Fatma  Ozkan",
                location: "İzmir",
                rating: 5,
                comment: "I prefer organic products and I found really good quality organic fruits here. I am very satisfied."
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-b from-gray-50 to-white rounded-3xl p-8 shadow-lg border border-gray-100"
                variants={itemVariants}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.comment}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-12 border border-green-100 shadow-lg">
              <motion.div
                className="mb-8"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-10 h-10 text-white" />
                </div>
              </motion.div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                Stay Informed about Discounts and Innovations
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Be the first to know about special discounts, new products and seasonal fruits.
                Sign up now and get 15% welcome discount!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-200"
                />
                <Button className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl">
                  Become Member
                </Button>
              </div>
              
              <p className="text-sm text-gray-500 mt-4">
                We do not send spam. You can unsubscribe at any time.
              </p>
            </div>
          </motion.div>
        </div>
      </section>


    </div>
  )
}
