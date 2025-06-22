import Link from 'next/link'
import { Apple, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Heart, Truck, Shield, Award } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Trust Badges */}
        <div className="py-12 border-b border-gray-700/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Heart, title: "Customer Satisfaction", subtitle: "4.9/5 Score" },
              { icon: Truck, title: "Fast Delivery", subtitle: "Same Day " },
              { icon: Shield, title: "Secure Shopping", subtitle: "SSL Security" },
              { icon: Award, title: "Quality Guarantee", subtitle: "100% Natural" }
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-400">{feature.subtitle}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                  <Apple className="h-7 w-7 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold">FreshFruit</span>
                  <span className="text-sm text-green-400">Natural & Fresh</span>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                The freshest and highest quality fruits, direct from the farmer to your table. 
                Enjoy a healthy life with us.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: Facebook, href: "#" },
                  { icon: Twitter, href: "#" },
                  { icon: Instagram, href: "#" }
                ].map((social, index) => (
                  <Link 
                    key={index}
                    href={social.href} 
                    className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-green-600 transition-all duration-200 hover:scale-110"
                  >
                    <social.icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Quick Access</h3>
              <nav className="flex flex-col space-y-3">
                {[
                  { href: "/", label: "Home Page" },
                  { href: "/products", label: "Products" },
                  { href: "/about", label: "About" },
                  { href: "/contact", label: "Contact" }
                ].map((link, index) => (
                  <Link 
                    key={index}
                    href={link.href} 
                    className="text-gray-300 hover:text-green-400 transition-colors text-sm flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-green-400 transition-all duration-200 mr-0 group-hover:mr-2"></span>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>



            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Contact</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 bg-gray-800/50 rounded-xl">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Phone</p>
                    <p className="text-white font-semibold">+90 (212) 555-0123</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-3 bg-gray-800/50 rounded-xl">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">E-mail</p>
                    <p className="text-white font-semibold">info@freshfruit.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-3 bg-gray-800/50 rounded-xl">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Adsress</p>
                    <p className="text-white font-semibold">
                      Ataturk Mah. Çiftçi Sok. No:15<br />
                      Kadıkoy, Istanbul
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700/50 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-gray-400 text-sm">
                © 2024 FreshFruit. All rights reserved.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { href: "/terms", label: "Terms of Use" },
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/cookies", label: "Cookie Policy" }
              ].map((link, index) => (
                <Link 
                  key={index}
                  href={link.href} 
                  className="text-gray-400 hover:text-green-400 transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 