'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function generateDescriptionAI(productName: string): Promise<string> {
  console.log("API Key seen by server:", process.env.GEMINI_API_KEY ? "API key is present" : "API key is missing");
  
  // Check if API key exists
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }
  
  try {
    // Initialize the Google AI client using the API key from environment variables
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Select the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Create a detailed prompt for the AI
    const prompt = `Write a compelling, short, and SEO-friendly e-commerce product description for the following fruit: ${productName}. Focus on its taste, freshness, and benefits. Use an engaging and warm tone. Write it in Turkish.`;
    
    // Generate the content
    const result = await model.generateContent(prompt);
    
    // Get the response and return it as text
    const text = result.response.text();
    return text;
  } catch (error) {
    console.error('Error generating AI description:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('API_KEY_INVALID')) {
        throw new Error('Invalid Gemini API key. Please check your API key configuration.');
      } else if (error.message.includes('PERMISSION_DENIED')) {
        throw new Error('Permission denied. Please check your Gemini API key permissions.');
      } else if (error.message.includes('QUOTA_EXCEEDED')) {
        throw new Error('API quota exceeded. Please check your Gemini API usage limits.');
      } else {
        throw new Error(`AI service error: ${error.message}`);
      }
    }
    
    throw new Error('Failed to generate product description. Please try again.');
  }
}

export async function addFruit(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  
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
  
  // Validate image file
  if (!imageFile || imageFile.size === 0) {
    throw new Error('Please select an image file')
  }
  
  // Generate unique file path to prevent overwrites
  const filePath = `public/${Date.now()}-${imageFile.name}`
  
  // Upload image to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('fruit-images')
    .upload(filePath, imageFile)
  
  if (uploadError) {
    throw new Error(`Failed to upload image: ${uploadError.message}`)
  }
  
  // Get public URL of uploaded image
  const { data: urlData } = supabase.storage
    .from('fruit-images')
    .getPublicUrl(uploadData.path)
  
  // Insert new fruit into Supabase with image URL
  const { error } = await supabase
    .from('fruits')
    .insert({
      name,
      description,
      price_per_kg: pricePerKg,
      stock_kg: stockKg,
      category_id: categoryId,
      image_url: urlData.publicUrl
    })
  
  if (error) {
    throw new Error(`Failed to add fruit: ${error.message}`)
  }
  
  // Revalidate and redirect
  revalidatePath('/admin/products')
  redirect('/admin/products')
}

export async function getCategories() {
  const supabase = await createSupabaseServerClient();
  
  // Fetch categories from the database
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  
  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`)
  }
  
  return data || []
} 