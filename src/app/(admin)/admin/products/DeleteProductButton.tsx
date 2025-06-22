'use client'

import { Button } from '@/components/ui/button'

export default function DeleteProductButton() {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      event.preventDefault()
    }
  }

  return (
    <Button
      type="submit"
      variant="destructive"
      size="sm"
      onClick={handleClick}
    >
      Delete
    </Button>
  )
} 