// 'use server'

// import { redirect } from 'next/navigation'
// import { revalidatePath } from 'next/cache'
// import { createSupabaseServerClient } from '@/lib/supabase/server'

// export async function addFruit(formData: FormData) {
//   const supabase = await createSupabaseServerClient();
  
//   // Parse form data
//   const name = formData.get('name') as string
//   const description = formData.get('description') as string
//   const pricePerKg = parseFloat(formData.get('price_per_kg') as string)
//   const stockKg = parseFloat(formData.get('stock_kg') as string)
//   const categoryId = parseInt(formData.get('category_id') as string)
//   const imageFile = formData.get('image') as File
  
//   // Validate required fields
//   if (!name || !description || isNaN(pricePerKg) || isNaN(stockKg) || isNaN(categoryId)) {
//     throw new Error('All fields are required and price/stock/category must be valid numbers')
//   }
  
//   // Validate image file
//   if (!imageFile || imageFile.size === 0) {
//     throw new Error('Please select an image file')
//   }
  
//   // Generate unique file path to prevent overwrites
//   const filePath = `public/${Date.now()}-${imageFile.name}`
  
//   // Upload image to Supabase Storage
//   const { data: uploadData, error: uploadError } = await supabase.storage
//     .from('fruit-images')
//     .upload(filePath, imageFile)
  
//   if (uploadError) {
//     throw new Error(`Failed to upload image: ${uploadError.message}`)
//   }
  
//   // Get public URL of uploaded image
//   const { data: urlData } = supabase.storage
//     .from('fruit-images')
//     .getPublicUrl(uploadData.path)
  
//   // Insert new fruit into Supabase with image URL
//   const { error } = await supabase
//     .from('fruits')
//     .insert({
//       name,
//       description,
//       price_per_kg: pricePerKg,
//       stock_kg: stockKg,
//       category_id: categoryId,
//       image_url: urlData.publicUrl
//     })
  
//   if (error) {
//     throw new Error(`Failed to add fruit: ${error.message}`)
//   }
  
//   // Revalidate and redirect
//   revalidatePath('/admin/products')
//   redirect('/admin/products')
// }

// export async function getCategories() {
//   const supabase = await createSupabaseServerClient();
  
//   // Fetch categories from the database
//   const { data, error } = await supabase
//     .from('categories')
//     .select('*')
//     .order('name')
  
//   if (error) {
//     throw new Error(`Failed to fetch categories: ${error.message}`)
//   }
  
//   return data || []
// } 