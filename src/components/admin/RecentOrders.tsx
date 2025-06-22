import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

interface Order {
  id: number
  created_at: string
  total_price: number
  status: string
  user_id: string
}

interface RecentOrdersProps {
  orders: Order[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Pending'
      case 'completed':
        return 'Completed'
      case 'cancelled':
        return 'Cancel'
      default:
        return status
    }
  }

  if (orders.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
         There are no orders yet.
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">
              {order.user_id.slice(0, 8)}...
            </TableCell>
            <TableCell>
              {new Date(order.created_at).toLocaleDateString('tr-TR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </TableCell>
            <TableCell>
              <Badge 
                variant="secondary" 
                className={getStatusColor(order.status)}
              >
                {getStatusText(order.status)}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              ₺{order.total_price.toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 