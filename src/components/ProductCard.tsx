import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import { AddToCartButton } from '@/components/AddToCartButton'

type Product = {
  id: number
  name: string
  price_per_kg: number
  image_url: string | null
  categories?: {
    name: string
  } | null
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group border-0 shadow-sm hover:shadow-md">
      <div className="relative aspect-square overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-xs">No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        
        {/* Category Badge */}
        {product.categories && (
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <span className="text-xs font-medium text-gray-700">{product.categories.name}</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-3 space-y-2">
        <div className="space-y-1">
          <h3 className="font-semibold text-sm line-clamp-2 leading-tight">{product.name}</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-green-600">
                ${product.price_per_kg.toFixed(2)}
              </span>
              <span className="text-xs text-gray-500">per kg</span>
            </div>
            
            <Link 
              href={`/products/${product.id}`}
              className={buttonVariants({ 
                variant: "outline",
                size: "sm", 
                className: "h-8 px-3 text-xs border-gray-300 hover:bg-gray-50" 
              })}
            >
              Show
            </Link>
          </div>
          
          <AddToCartButton 
            product={{
              id: product.id.toString(),
              name: product.name,
              image_url: product.image_url || '',
              price_per_kg: product.price_per_kg
            }} 
          />
        </div>
      </CardContent>
    </Card>
  )
}
