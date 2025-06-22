import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import CategoryForm from './CategoryForm'

export default function NewCategoryPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/admin/categories">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add New Category</h2>
          <p className="text-muted-foreground">
            Create a new product category
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <CategoryForm />
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