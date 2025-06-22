'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateCategory } from '../../actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Category {
  id: number
  name: string
  description: string | null
}

interface EditCategoryFormProps {
  category: Category
}

export default function EditCategoryForm({ category }: EditCategoryFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    try {
      const result = await updateCategory(formData)
      if (result && !result.success) {
        toast.error(result.error)
      } else if (result && result.success) {
        toast.success('Category updated successfully')
        router.push('/admin/categories')
      }
    } catch (error) {
      toast.error('Unexpected error occured')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          <input type="hidden" name="id" value={category.id} />
          
          <div className="space-y-2">
            <Label htmlFor="name">
              Category Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={category.name}
              placeholder="Ex: Tropical Fruits"
              className="w-full"
              disabled={isLoading}
            />
            <p className="text-sm text-muted-foreground">
             
            </p>
          </div> Enter a descriptive name for the category

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={category.description || ''}
              placeholder="Write a short description about the products in this category..."
              rows={4}
              className="w-full"
              disabled={isLoading}
            />
            <p className="text-sm text-muted-foreground">
              Optional: Additional information about the category
            </p>
          </div>

          <div className="flex space-x-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Category'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 