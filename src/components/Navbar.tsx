import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import { User, Apple, Search, Menu, X } from 'lucide-react'
import { NavbarCart } from './NavbarCart'
import { signOut } from '@/app/(storefront)/auth/actions'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { MobileNav } from './MobileNav'

export default async function Navbar() {
  // Fetch current user data on the server
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const navigationLinks = [
    { href: '/', label: 'Home Page' },
    { href: '/products', label: 'Products' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
              <Apple className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                FreshFruit
              </span>
              <span className="text-xs text-green-600 font-medium -mt-1">Natural & Fresh</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-gray-700 rounded-xl hover:text-green-600 hover:bg-green-50 transition-all duration-200 group"
              >
                {link.label}
                <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-green-500 to-emerald-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </Link>
            ))}
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search product..."
                className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-200 bg-gray-50/50 focus:bg-white"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Search Icon for Mobile */}
            <Button variant="ghost" size="sm" className="md:hidden p-2">
              <Search className="h-5 w-5" />
            </Button>

            {/* Dynamic Cart Button */}
            <NavbarCart />

            {/* Conditional Rendering based on user authentication */}
            {user ? (
              // Logged-in View
              <div className="hidden md:flex items-center space-x-3">
                {/* User Profile */}
                <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden lg:block">
                    <span className="text-sm font-medium text-gray-900">
                      {user.email?.split('@')[0]}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <form action={signOut}>
                  <Button 
                    type="submit" 
                    variant="ghost" 
                    size="sm"
                    className="rounded-xl hover:bg-red-50 hover:text-red-600"
                  >
                    Exit
                  </Button>
                </form>
              </div>
            ) : (
              // Guest View  
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  href="/login"
                  className={buttonVariants({ 
                    variant: "ghost", 
                    size: "sm",
                    className: "rounded-xl hover:bg-gray-50"
                  })}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className={buttonVariants({ 
                    variant: "default", 
                    size: "sm",
                    className: "rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all duration-200"
                  })}
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu */}
            <MobileNav user={user} navigationLinks={navigationLinks} />
          </div>
        </div>
      </div>
    </nav>
  )
} 