import { createSupabaseServerClient } from '@/lib/supabase/server'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit } from 'lucide-react'
import Link from 'next/link'
import DeleteCategoryButton from './DeleteCategoryButton'

interface Category {
  id: number
  name: string
  description: string | null
  created_at: string
}

export default async function CategoriesPage() {
  const supabase = await createSupabaseServerClient()

  // Fetch all categories sorted alphabetically by name
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Category Management</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                There was an error loading categories.Unknown error
              </p>
              <p className="text-sm text-red-600">
                Error: {error.message || 'Unknown error'}
              </p>
              <p className="text-xs text-muted-foreground">
                If you see this error, the categories table may not have been created yet.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const typedCategories = categories as Category[] || []

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Category Management</h2>
          <p className="text-muted-foreground">
             Manage and organize product categories
          </p>
        </div>
        <Link href="/admin/categories/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
             Add New Category
          </Button>
        </Link>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            All Categories
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({typedCategories.length} category)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {typedCategories.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <p className="text-muted-foreground">
                There are no categories yet.
              </p>
              <Link href="/admin/categories/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Category
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Transactions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {typedCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>
                      {category.description || (
                        <span className="text-muted-foreground italic">
                          No description
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link href={`/admin/categories/edit/${category.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <DeleteCategoryButton 
                          categoryId={category.id}
                          categoryName={category.name}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 