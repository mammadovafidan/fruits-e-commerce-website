'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Heart,
  Leaf,
  Users,
  Award,
  Truck,
  Shield,
  Target,
  Globe,
  TrendingUp,
  Star,
  Mail,
  Phone,
  MapPin,
  ArrowRight
} from 'lucide-react'

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 overflow-hidden">
        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 right-10 w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-20 blur-xl"
          animate={floatingAnimation}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-32 h-32 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full opacity-15 blur-xl"
          animate={{
            ...floatingAnimation,
            transition: { ...floatingAnimation.transition, delay: 1.5 }
          }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-green-200 mb-8 shadow-lg"
              variants={itemVariants}
            >
              <Heart className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-800">Pioneer of Naturalness</span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-green-700 to-emerald-600 bg-clip-text text-transparent leading-tight"
              variants={itemVariants}
            >
              About
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              25 years on the journey from the farmer to your table, We are proud to be the reliable address of
              <span className="text-green-600 font-semibold">  naturalness and freshness. </span>
              
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              variants={itemVariants}
            >
              <Link
                href="/products"
                className={buttonVariants({
                  size: "lg",
                  className: "text-lg px-8 py-4 h-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                })}
              >
                Explore Our Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Company Story Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Content */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center px-3 py-1 bg-green-100 rounded-full mb-4">
                  <span className="text-sm font-medium text-green-800">Our Story</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                  Our Passion for Naturalness Brought Us Here
                </h2>
              </div>

              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  In 1998, when we started our journey as a small family business, our goal was always the same: <strong className="text-gray-900">The freshest, highest quality and most natural fruits</strong>
                  to bring them together with our customers.
                </p>
                <p>
                  Today, we work with more than 500 local farmers, bringing health to the tables of an average of 2000 families a day.
                  By blending the power of technology with traditional values,
                  we offer solutions that meet the needs of the modern world.
                </p>
                <p>
                  <strong className="text-green-600">
                    Quality, trust and sustainability</strong>
                  With our principles, we continue to work to leave a cleaner world for future generations.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-2xl">
                  <div className="text-3xl font-bold text-green-600 mb-2">25+</div>
                  <div className="text-sm text-gray-600">Years of Experience</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-2xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                  <div className="text-sm text-gray-600">
                    Farmer Partner</div>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
                  alt="Çiftçi ve meyve bahçesi"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl opacity-20" />
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-2xl opacity-20" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our values that determine the way we do business and form the basis of our promise to our customers
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Leaf,
                title: "Naturalness",
                description: "We ensure that our products are 100% natural and organic and never allow chemical additives.",
                color: "green"
              },
              {
                icon: Heart,
                title: "Quality",
                description: "We carefully select and quality control every product. Customer satisfaction is our priority.",
                color: "red"
              },
              {
                icon: Shield,
                title: "Trust",
                description: "We continue to gain the trust of our customers with our transparent business processes and honest approach.",
                color: "blue"
              },
              {
                icon: Globe,
                title: "Sustainability",
                description: "We leave a clean world for future generations with environmentally friendly production methods and packaging.",
                color: "emerald"
              },
              {
                icon: Users,
                title: "Social Responsibility",
                description: "We support local farmers and contribute to regional development through fair trade principles.",
                color: "purple"
              },
              {
                icon: TrendingUp,
                title: "Innovation",
                description: "We are constantly developing by utilizing the power of technology and looking for ways to provide better service.",
                color: "orange"
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${value.color === 'green' ? 'bg-green-100 group-hover:bg-green-200' :
                  value.color === 'red' ? 'bg-red-100 group-hover:bg-red-200' :
                    value.color === 'blue' ? 'bg-blue-100 group-hover:bg-blue-200' :
                      value.color === 'emerald' ? 'bg-emerald-100 group-hover:bg-emerald-200' :
                        value.color === 'purple' ? 'bg-purple-100 group-hover:bg-purple-200' :
                          'bg-orange-100 group-hover:bg-orange-200'
                  }`}>
                  <value.icon className={`w-8 h-8 ${value.color === 'green' ? 'text-green-600' :
                    value.color === 'red' ? 'text-red-600' :
                      value.color === 'blue' ? 'text-blue-600' :
                        value.color === 'emerald' ? 'text-emerald-600' :
                          value.color === 'purple' ? 'text-purple-600' :
                            'text-orange-600'
                    }`} />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">FreshFruit in Numbers</h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Years of experience and concrete indicators of our customer satisfaction
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { number: "100K+", label: "Happy Customer", icon: Users },
              { number: "500+", label: "Farmer Partner", icon: Leaf },
              { number: "1M+", label: "", icon: Truck },
              { number: "4.9/5", label: "Customer Score", icon: Star }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center"
                variants={itemVariants}
              >
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-green-100">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              With our experienced and passionate team, we strive to provide you with the best service
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                name: "Ahmet Ciftci",
                role: "Founder & General Manager",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                description: "With 25 years of agricultural experience, our visionary leader who has brought our company to this day."
              },
              {
                name: "Fatma Demir",
                role: "Quality Control Manager",
                image: "https://images.unsplash.com/photo-1521566652839-697aa473761a?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                description: "Our expert who is the assurance of our product quality with his food engineering formation."
              },
              {
                name: "Mehmet Kaya",
                role: "Farmer Relations Coordinator",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                description: "Our expert in building strong ties with our farmers and supporting sustainable agriculture."
              }
            ].map((member, index) => (
              <motion.div
                key={index}
                className="group text-center"
                variants={itemVariants}
                whileHover={{ y: -10 }}
              >
                <div className="relative mb-6">
                  <div className="aspect-square w-48 mx-auto rounded-3xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-green-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 leading-relaxed">{member.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-12 border border-green-100 shadow-lg">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                Let's Enjoy Naturalness Together
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                We are here to offer you the freshest and highest quality fruits.
                Contact us for your inquiries.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/products"
                  className={buttonVariants({
                    size: "lg",
                    className: "text-lg px-8 py-4 h-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  })}
                >
                  View Our Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/contact"
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "text-lg px-8 py-4 h-auto border-2 border-green-300 hover:bg-green-50"
                  })}
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Contact
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 