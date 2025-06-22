'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, Filter, SlidersHorizontal, Grid, List, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { supabase } from '@/lib/supabase/client'
import ProductCard from '@/components/ProductCard'

type Product = {
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

type Category = {
  id: number
  name: string
}

type SortOption = {
  value: string
  label: string
}

const sortOptions: SortOption[] = [
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'price-asc', label: 'Price (Low-High)' },
  { value: 'price-desc', label: 'Price (High-Low)' },
  { value: 'newest', label: 'The Newest' },
  { value: 'oldest', label: 'The Oldest' },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [priceRange, setPriceRange] = useState([0, 100])
  const [maxPrice, setMaxPrice] = useState(100)
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const itemsPerPage = 12

  // Fetch products and categories
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // Fetch products with categories
        const { data: productsData, error: productsError } = await supabase
          .from('fruits')
          .select('*, categories(id, name)')
          .order('created_at', { ascending: false })

        if (productsError) throw productsError

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('name')

        if (categoriesError) throw categoriesError

        setProducts(productsData || [])
        setCategories(categoriesData || [])

        // Set max price based on products
        if (productsData && productsData.length > 0) {
          const prices = productsData.map(p => p.price_per_kg)
          const max = Math.ceil(Math.max(...prices))
          setMaxPrice(max)
          setPriceRange([0, max])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Search filter
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !product.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }

      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category_id)) {
        return false
      }

      // Price filter
      if (product.price_per_kg < priceRange[0] || product.price_per_kg > priceRange[1]) {
        return false
      }

      return true
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'price-asc':
          return a.price_per_kg - b.price_per_kg
        case 'price-desc':
          return b.price_per_kg - a.price_per_kg
        case 'newest':
          return b.id - a.id // Assuming higher ID = newer
        case 'oldest':
          return a.id - b.id
        default:
          return 0
      }
    })

    return filtered
  }, [products, searchTerm, selectedCategories, priceRange, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage)
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Handle category filter
  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId])
    } else {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId))
    }
    setCurrentPage(1)
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategories([])
    setPriceRange([0, maxPrice])
    setSortBy('newest')
    setCurrentPage(1)
  }

  // Active filters count
  const activeFiltersCount = 
    (searchTerm ? 1 : 0) + 
    selectedCategories.length + 
    (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0)

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div className="space-y-3">
        <h3 className="font-semibold">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={(checked) => 
                  handleCategoryChange(category.id, checked as boolean)
                }
              />
              <label
                htmlFor={`category-${category.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h3 className="font-semibold">Price Range</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={maxPrice}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          Clear Filters ({activeFiltersCount})
        </Button>
      )}
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">All Products</h1>
        <p className="text-gray-600">
          Discover our freshest and highest quality fruits
        </p>
      </div>

      {/* Search and Controls */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search product..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2">
            {/* Mobile Filter Button */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterSection />
                </div>
              </SheetContent>
            </Sheet>

            {/* View Mode Toggle */}
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 hidden sm:block">Sort:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <Badge variant="secondary">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            )}
            {selectedCategories.map((categoryId) => {
              const category = categories.find(c => c.id === categoryId)
              return category ? (
                <Badge key={categoryId} variant="secondary">
                  {category.name}
                  <button
                    onClick={() => handleCategoryChange(categoryId, false)}
                    className="ml-1 hover:text-red-500"
                  >
                    ×
                  </button>
                </Badge>
              ) : null
            })}
            {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
              <Badge variant="secondary">
                Price: ${priceRange[0]} - ${priceRange[1]}
                <button
                  onClick={() => setPriceRange([0, maxPrice])}
                  className="ml-1 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="h-5 w-5" />
                <h2 className="font-semibold">Filters</h2>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </div>
              <FilterSection />
            </CardContent>
          </Card>
        </div>

        {/* Products Grid/List */}
        <div className="flex-1">
          {/* Results Info */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {loading ? 'Yükleniyor...' : `${filteredAndSortedProducts.length} products found`}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className={`grid gap-6 ${viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
            }`}>
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-square bg-gray-200 animate-pulse" />
                  <CardContent className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
                    <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Products Display */}
          {!loading && (
            <>
              {paginatedProducts.length > 0 ? (
                <div className={`grid gap-6 ${viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
                }`}>
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-gray-500 text-lg mb-4">
                      No products matching the criteria you are looking for were found.
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear Filters
                  </Button>
                </Card>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? 'default' : 'outline'}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        )
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return <span key={page} className="px-2">...</span>
                      }
                      return null
                    })}

                    <Button
                      variant="outline"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
} 