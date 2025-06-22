'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createCategory(formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const name = formData.get('name') as string
    const description = formData.get('description') as string

    if (!name || name.trim().length === 0) {
      return { success: false, error: 'Category name required' }
    }

    const { error } = await supabase
      .from('categories')
      .insert([{
        name: name.trim(),
        description: description.trim() || null
      }])

    if (error) {
      console.error('Create category error:', error)
      return { success: false, error: 'An error occurred while creating a category' }
    }

    revalidatePath('/admin/categories')
    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function updateCategory(formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const description = formData.get('description') as string

    if (!id || !name || name.trim().length === 0) {
      return { success: false, error: 'Category ID and name required' }
    }

    const { error } = await supabase
      .from('categories')
      .update({
        name: name.trim(),
        description: description.trim() || null
      })
      .eq('id', parseInt(id))

    if (error) {
      console.error('Update category error:', error)
      return { success: false, error: 'An error occurred while updating the category' }
    }

    revalidatePath('/admin/categories')
    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function deleteCategory(formData: FormData) {
  try {
    const supabase = await createSupabaseServerClient()
    
    const id = formData.get('id') as string

    if (!id) {
      return { success: false, error: 'Category ID required' }
    }

    // Check if category has products
    const { data: products, error: checkError } = await supabase
      .from('fruits')
      .select('id')
      .eq('category_id', parseInt(id))
      .limit(1)

    if (checkError) {
      console.error('Check products error:', checkError)
      return { success: false, error: 'An error occurred while checking the category' }
    }

    if (products && products.length > 0) {
      return { success: false, error: 'There are products belonging to this category. First delete the products or move them to another category.' }
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', parseInt(id))

    if (error) {
      console.error('Delete category error:', error)
      return { success: false, error: 'An error occurred while deleting a category' }
    }

    revalidatePath('/admin/categories')
    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
} 