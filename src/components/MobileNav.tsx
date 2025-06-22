'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, ShoppingCart, User, Apple } from 'lucide-react'
import { signOut } from '@/app/(storefront)/auth/actions'

interface MobileNavProps {
  user: any;
  navigationLinks: Array<{ href: string; label: string }>;
}

export function MobileNav({ user, navigationLinks }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="sm">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2 pb-4 border-b">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Apple className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">FreshFruit</span>
          </div>
          
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-lg font-medium transition-colors hover:text-primary py-2"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          
          <div className="pt-4 border-t space-y-2">
            <Link
              href="/cart"
              className="flex items-center space-x-2 text-lg font-medium transition-colors hover:text-primary py-2"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Sepet</span>
            </Link>
            
            {user && (
              <Link
                href="/admin/products"
                className="flex items-center space-x-2 text-lg font-medium transition-colors hover:text-primary py-2"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-5 w-5" />
                <span>Admin Paneli</span>
              </Link>
            )}

            {/* Mobile Auth Section */}
            {user ? (
              <form action={signOut}>
                <Button type="submit" variant="ghost" className="w-full justify-start text-lg font-medium py-2 h-auto">
                  Çıkış Yap
                </Button>
              </form>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  className={buttonVariants({ variant: "ghost", className: "w-full justify-start text-lg font-medium py-2 h-auto" })}
                  onClick={() => setIsOpen(false)}
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className={buttonVariants({ variant: "ghost", className: "w-full justify-start text-lg font-medium py-2 h-auto" })}
                  onClick={() => setIsOpen(false)}
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
} 