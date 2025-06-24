'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
// import { Card, CardContent } from '@/components/ui/card'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageCircle,
  Headphones,
  Facebook,
  Twitter,
  Instagram,
  CheckCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Reset form after success
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

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
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
        {/* Floating Elements */}
        <motion.div 
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-20 blur-xl"
          animate={floatingAnimation}
        />
        <motion.div 
          className="absolute bottom-32 right-20 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-15 blur-xl"
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
              className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-blue-200 mb-8 shadow-lg"
              variants={itemVariants}
            >
              <MessageCircle className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">7/24 Support</span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-700 to-indigo-600 bg-clip-text text-transparent leading-tight"
              variants={itemVariants}
            >
              Contact
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              For questions, suggestions or feedback
              <span className="text-blue-600 font-semibold"> we are always with you</span>. 
              Feel free to contact us.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              variants={itemVariants}
            >
              <a 
                href="#contact-form"
                className={buttonVariants({ 
                  size: "lg", 
                  className: "text-lg px-8 py-4 h-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
                })}
              >
                Send Message
                <Send className="ml-2 h-5 w-5" />
              </a>
              <a 
                href="tel:+902125550123"
                className={buttonVariants({ 
                  variant: "outline", 
                  size: "lg",
                  className: "text-lg px-8 py-4 h-auto border-2 hover:bg-blue-50 backdrop-blur-sm" 
                })}
              >
                <Phone className="mr-2 h-5 w-5" />
                Call Now
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Contact us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose your nearest communication channel and we will help you quickly
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Phone,
                title: "Telephone",
                content: "+90 (212) 555-0123",
                subContent: "Monday - Sunday: 08:00 - 22:00",
                action: "tel:+902125550123",
                color: "green"
              },
              {
                icon: Mail,
                title: "E-mail",
                content: "info@freshfruit.com",
                subContent: "24 saat içinde yanıtlıyoruz",
                action: "mailto:info@freshfruit.com",
                color: "blue"
              },
              {
                icon: MessageCircle,
                title: "WhatsApp",
                content: "+90 (533) 555-0123",
                subContent: "Anında destek alın",
                action: "https://wa.me/905335550123",
                color: "emerald"
              },
              {
                icon: MapPin,
                title: "Address",
                content: "Atatürk Mah. Çiftçi Sok. No:15",
                subContent: "Kadıkoy, Istanbul",
                action: "#location",
                color: "purple"
              }
            ].map((contact, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <a 
                  href={contact.action}
                  className="block bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${
                    contact.color === 'green' ? 'bg-green-100 group-hover:bg-green-200' :
                    contact.color === 'blue' ? 'bg-blue-100 group-hover:bg-blue-200' :
                    contact.color === 'emerald' ? 'bg-emerald-100 group-hover:bg-emerald-200' :
                    'bg-purple-100 group-hover:bg-purple-200'
                  }`}>
                    <contact.icon className={`w-8 h-8 ${
                      contact.color === 'green' ? 'text-green-600' :
                      contact.color === 'blue' ? 'text-blue-600' :
                      contact.color === 'emerald' ? 'text-emerald-600' :
                      'text-purple-600'
                    }`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{contact.title}</h3>
                  <p className="text-gray-900 font-semibold mb-2">{contact.content}</p>
                  <p className="text-gray-600 text-sm">{contact.subContent}</p>
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section id="contact-form" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-3xl font-bold mb-6 text-gray-900">Send Message</h3>
                <p className="text-gray-600 mb-8">
                  You can contact us by filling out the form. We will get back to you as soon as possible.
                </p>

                {isSubmitted ? (
                  <motion.div 
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Your Message Sent!</h4>
                    <p className="text-gray-600">We will get back to you within 24 hours.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Name Last Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                          placeholder="Enter your first and last name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          E-mail *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                          placeholder="E-posta adresinizi girin"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Topic*
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                      >
                        <option value="">Select topic</option>
                        <option value="order">About the Order</option>
                        <option value="product">Product Information</option>
                        <option value="complaint">Complaint</option>
                        <option value="suggestion">Suggestion</option>
                        <option value="partnership">Collaboration</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 resize-none"
                        placeholder="Write your message here..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Business Hours */}
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center mb-6">
                  <Clock className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">Working Hours</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { day: "Monday - Saturday", hours: "08:00 - 22:00" },
                    { day: "Sunday", hours: "09:00 - 21:00" },
                    { day: "Offical Holidays", hours: "10:00 - 18:00" }
                  ].map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-700 font-medium">{schedule.day}</span>
                      <span className="text-blue-600 font-semibold">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Support */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100">
                <div className="flex items-center mb-6">
                  <Headphones className="w-8 h-8 text-green-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">Fast Support</h3>
                </div>
                <p className="text-gray-700 mb-6">
                  You can get 24/7 support from our WhatsApp line for emergencies.
                </p>
                <a 
                  href="https://wa.me/905335550123"
                  className={buttonVariants({
                    className: "w-full bg-green-600 hover:bg-green-700 text-white rounded-xl"
                  })}
                >
                  Contact via WhatsApp
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Social Media</h3>
                <p className="text-gray-600 mb-6">Follow us for the latest news and special offers!</p>
                <div className="flex space-x-4">
                  {[
                    { icon: Facebook, href: "#", color: "bg-blue-600 hover:bg-blue-700" },
                    { icon: Twitter, href: "#", color: "bg-sky-500 hover:bg-sky-600" },
                    { icon: Instagram, href: "#", color: "bg-pink-600 hover:bg-pink-700" }
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className={`w-12 h-12 rounded-xl ${social.color} text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg hover:shadow-xl`}
                    >
                      <social.icon className="w-6 h-6" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quick answers to your questions
            </p>
          </motion.div>

          <motion.div
            className="max-w-4xl mx-auto space-y-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                question: "When will my order be delivered?",
                answer: "With our same day delivery service, we deliver your order to your address on the same day. Delivery times may vary depending on the order time."
              },
              {
                question: "Are your products organic?",
                answer: "Yes, all our products are 100% organic and natural. Our fruits are sourced from certified farmers and do not contain chemical fertilizers and pesticides."
              },
              {
                question: "Is there a minimum order amount?",
                answer: "Our minimum order amount is 100 TL. Shipping is free for orders of 150 TL and above."
              },
              {
                question: "How to make a return and exchange?",
                answer: "If you are not satisfied with your products, you can return them within 24 hours from the date of delivery. We have a 100% money back guarantee."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-start space-x-4">
                  <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
} 