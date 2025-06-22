import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import EditCategoryForm from './EditCategoryForm'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getCategory(id: number) {
  const supabase = await createSupabaseServerClient()

  const { data: category, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !category) {
    return null
  }

  return category
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params
  const categoryId = parseInt(id)

  if (isNaN(categoryId)) {
    notFound()
  }

  const category = await getCategory(categoryId)

  if (!category) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/admin/categories">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri Dön
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Category</h2>
          <p className="text-muted-foreground">
            "{category.name}"
            edit category
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <EditCategoryForm category={category} />
        <div className="mt-4">
          <Link href="/admin/categories">
            <Button variant="outline" className="w-full">
             Cancel
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 