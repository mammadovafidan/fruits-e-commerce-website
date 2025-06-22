'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Wand2, Loader2 } from 'lucide-react'
import { generateDescriptionAI } from '../actions'
import { addFruit, getCategories } from '../actions'

interface Category {
  id: number;
  name: string;
}

export default function NewFruitPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isAIGenerating, setIsAIGenerating] = useState(false)
  
  // Form state (for AI functionality)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pricePerKg: '',
    stockKg: '',
    categoryId: '',
  })

  // Fetch categories on component mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories()
        setCategories(data || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    
    fetchCategories()
  }, [])

  // Handle AI description generation
  const handleGenerateAIDescription = async () => {
    if (!formData.name.trim()) {
      alert('Please enter a fruit name first!')
      return
    }

    setIsAIGenerating(true)
    try {
      const aiDescription = await generateDescriptionAI(formData.name)
      setFormData(prev => ({ ...prev, description: aiDescription }))
    } catch (error) {
      console.error('Error generating AI description:', error)
      alert('Failed to generate description. Please try again.')
    } finally {
      setIsAIGenerating(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Add New Fruit</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={addFruit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Fruit Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="e.g., Red Apple"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="description">Description</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateAIDescription}
                  disabled={isAIGenerating || !formData.name.trim()}
                  className="h-6 text-xs"
                >
                  {isAIGenerating ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3 h-3 mr-1" />
                      Create with AI
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the fruit, its taste, origin, etc."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category_id">Category</Label>
              <Select 
                name="category_id"
                value={formData.categoryId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Fruit Image</Label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price_per_kg">Price per KG ($)</Label>
                <Input
                  id="price_per_kg"
                  name="price_per_kg"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g., 4.99"
                  value={formData.pricePerKg}
                  onChange={(e) => setFormData(prev => ({ ...prev, pricePerKg: e.target.value }))}
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
                  placeholder="e.g., 50.5"
                  value={formData.stockKg}
                  onChange={(e) => setFormData(prev => ({ ...prev, stockKg: e.target.value }))}
                  required
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Add Fruit
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 