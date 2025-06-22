import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import DeleteProductButton from './DeleteProductButton'

// Server Action for deleting a product
async function deleteProduct(id: number) {
  'use server'
  
  const supabase = await createSupabaseServerClient();
  
  try {
    console.log(`Starting product deletion process for ID: ${id}`);
    
    // Step 1: Fetch Product to get the image_url
    console.log('Step 1: Fetching product details...');
    const { data: product, error: fetchError } = await supabase
      .from('fruits')
      .select('image_url')
      .eq('id', id)
      .single()
    
    if (fetchError) {
      console.error('FETCH ERROR:', fetchError);
      throw new Error(`Failed to fetch product: ${fetchError.message}`);
    }
    
    if (!product) {
      console.error('PRODUCT NOT FOUND:', id);
      throw new Error('Product not found');
    }
    
    console.log('Step 1: Product fetched successfully', { id, image_url: product.image_url });
    
    // Step 2: Delete Image from Storage
    if (product.image_url) {
      console.log('Step 2: Deleting image from storage...');
      try {
        // Extract file path from URL
        const url = new URL(product.image_url);
        const pathParts = url.pathname.split('/');
        const bucketIndex = pathParts.findIndex(part => part === 'fruit-images');
        
        if (bucketIndex !== -1 && bucketIndex + 1 < pathParts.length) {
          const filePath = pathParts.slice(bucketIndex + 1).join('/');
          console.log('Attempting to delete file:', filePath);
          
          const { error: storageError } = await supabase.storage
            .from('fruit-images')
            .remove([filePath]);
          
          if (storageError) {
            console.error('STORAGE ERROR (continuing with deletion):', storageError);
          } else {
            console.log('Step 2: Image deleted successfully from storage');
          }
        } else {
          console.log('Step 2: Could not parse file path from URL, skipping storage deletion');
        }
      } catch (urlError) {
        console.error('STORAGE URL PARSING ERROR (continuing with deletion):', urlError);
      }
    } else {
      console.log('Step 2: No image to delete, skipping storage deletion');
    }
    
    // Step 3: Delete from Database
    console.log('Step 3: Deleting product from database...');
    const { error: dbError } = await supabase
      .from('fruits')
      .delete()
      .eq('id', id);
    
    if (dbError) {
      console.error('DATABASE DELETE ERROR:', dbError);
      throw new Error(`Failed to delete product from database: ${dbError.message}`);
    }
    
    console.log('Step 3: Product deleted successfully from database');
    
    // Step 4: Revalidate (only if database deletion was successful)
    console.log('Step 4: Revalidating products page...');
    revalidatePath('/admin/products');
    console.log('Product deletion process completed successfully');
    
  } catch (error) {
    console.error('ERROR DELETING PRODUCT:', error);
    throw error;
  }
}

// Type for the joined data
type FruitWithCategory = {
  id: number
  name: string
  description: string
  price_per_kg: number
  stock_kg: number
  image_url: string | null
  categories: {
    name: string
  } | null
}

export default async function ProductsPage() {
  const supabase = await createSupabaseServerClient();
  
  // Fetch all fruits with their category names using a join
  const { data: fruits, error } = await supabase
    .from('fruits')
    .select('*, categories(name)')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`)
  }

  const fruitsWithCategories = fruits as FruitWithCategory[]

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-6">
        {/* Header with Add New Product button */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Product Management</h1>
          <Link href="/admin/products/new">
            <Button>Add New Product</Button>
          </Link>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Products</CardTitle>
          </CardHeader>
          <CardContent>
            {fruitsWithCategories && fruitsWithCategories.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image.</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price/kg</TableHead>
                    <TableHead>Stock (kg)</TableHead>
                    <TableHead>Operations</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fruitsWithCategories.map((fruit) => (
                    <TableRow key={fruit.id}>
                      <TableCell>
                        {fruit.image_url ? (
                          <Image
                            src={fruit.image_url}
                            alt={fruit.name}
                            width={50}
                            height={50}
                            className="rounded-md object-cover"
                          />
                        ) : (
                          <div className="w-[50px] h-[50px] bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
                            No Image
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{fruit.name}</TableCell>
                      <TableCell>
                        {fruit.categories?.name || 'Kategori Yok'}
                      </TableCell>
                      <TableCell>${fruit.price_per_kg.toFixed(2)}</TableCell>
                      <TableCell>{fruit.stock_kg} kg</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link 
                            href={`/admin/products/edit/${fruit.id}`}
                            className={buttonVariants({ variant: "outline", size: "sm" })}
                          >
                            Edit
                          </Link>
                          <form action={deleteProduct.bind(null, fruit.id)}>
                            <DeleteProductButton />
                          </form>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No products added yet.</p>
                <Link href="/admin/products/new">
                  <Button className="mt-4">Add First Product</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 