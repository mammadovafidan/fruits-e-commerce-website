import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Server Action for updating a product
async function updateProduct(id: number, formData: FormData) {
  'use server'
  
  const supabase = await createSupabaseServerClient();
  
  try {
    // Parse form data
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const pricePerKg = parseFloat(formData.get('price_per_kg') as string)
    const stockKg = parseFloat(formData.get('stock_kg') as string)
    const categoryId = parseInt(formData.get('category_id') as string)
    const imageFile = formData.get('image') as File
    
    // Validate required fields
    if (!name || !description || isNaN(pricePerKg) || isNaN(stockKg) || isNaN(categoryId)) {
      throw new Error('All fields are required and price/stock/category must be valid numbers')
    }
    
    // Prepare update data
    const updateData: any = {
      name,
      description,
      price_per_kg: pricePerKg,
      stock_kg: stockKg,
      category_id: categoryId
    }
    
    // Handle image update if a new image is provided
    if (imageFile && imageFile.size > 0) {
      // First, get the current product to get old image URL
      const { data: currentProduct, error: fetchError } = await supabase
        .from('fruits')
        .select('image_url')
        .eq('id', id)
        .single()
      
      if (fetchError) {
        throw new Error(`Failed to fetch current product: ${fetchError.message}`)
      }
      
      // Generate unique file path for new image
      const filePath = `public/${Date.now()}-${imageFile.name}`
      
      // Upload new image to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('fruit-images')
        .upload(filePath, imageFile)
      
      if (uploadError) {
        throw new Error(`Failed to upload new image: ${uploadError.message}`)
      }
      
      // Get public URL of new image
      const { data: urlData } = supabase.storage
        .from('fruit-images')
        .getPublicUrl(uploadData.path)
      
      // Add new image URL to update data
      updateData.image_url = urlData.publicUrl
      
      // Delete old image if it exists
      if (currentProduct.image_url) {
        try {
          const url = new URL(currentProduct.image_url)
          const pathParts = url.pathname.split('/')
          const bucketIndex = pathParts.findIndex(part => part === 'fruit-images')
          if (bucketIndex !== -1 && bucketIndex + 1 < pathParts.length) {
            const oldFilePath = pathParts.slice(bucketIndex + 1).join('/')
            
            await supabase.storage
              .from('fruit-images')
              .remove([oldFilePath])
          }
        } catch (error) {
          console.error('Failed to delete old image:', error)
          // Continue with update even if old image deletion fails
        }
      }
    }
    
    // Update the product in database
    const { error } = await supabase
      .from('fruits')
      .update(updateData)
      .eq('id', id)
    
    // Check for database update errors
    if (error) {
      console.error('DATABASE UPDATE FAILED:', error)
      throw new Error('Failed to update product.')
    }
    
    // Only revalidate and redirect if update was successful
    revalidatePath('/admin/products')
    redirect('/admin/products')
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

// Type definitions
type Product = {
  id: number
  name: string
  description: string
  price_per_kg: number
  stock_kg: number
  category_id: number
  image_url: string | null
}

type Category = {
  id: number
  name: string
}

export default async function EditProductPage({ params: { id } }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  const productId = parseInt(id)
  
  if (isNaN(productId)) {
    throw new Error('Invalid product ID')
  }
  
  // Fetch the product to be edited
  const { data: product, error: productError } = await supabase
    .from('fruits')
    .select('*')
    .eq('id', productId)
    .single()
  
  if (productError) {
    throw new Error(`Failed to fetch product: ${productError.message}`)
  }
  
  // Fetch all categories for the dropdown
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  
  if (categoriesError) {
    throw new Error(`Failed to fetch categories: ${categoriesError.message}`)
  }
  
  const productData = product as Product
  const categoriesData = categories as Category[]

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateProduct.bind(null, productData.id)} encType="multipart/form-data" className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                defaultValue={productData.name}
                placeholder="e.g., Red Apple"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={productData.description}
                placeholder="Explain the taste of the fruit, its origin, etc."
                rows={4}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category_id">Category</Label>
              <Select name="category_id" defaultValue={productData.category_id.toString()} required>
                <SelectTrigger>
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  {categoriesData?.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Product Image (optional - to change the current image)</Label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {productData.image_url && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">Available image: </p>
                  <img 
                    src={productData.image_url} 
                    alt={productData.name}
                    className="w-20 h-20 object-cover rounded-md border"
                  />
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_per_kg">Price/KG ($)</Label>
                <Input
                  id="price_per_kg"
                  name="price_per_kg"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={productData.price_per_kg.toString()}
                  placeholder="e.g., 4.99"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stock_kg">Stock (KG)</Label>
                <Input
                  id="stock_kg"
                  name="stock_kg"
                  type="number"
                  step="0.1"
                  min="0"
                  defaultValue={productData.stock_kg.toString()}
                  placeholder="e.g., 50.5"
                  required
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Update
              </Button>
              <Button type="button" variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 