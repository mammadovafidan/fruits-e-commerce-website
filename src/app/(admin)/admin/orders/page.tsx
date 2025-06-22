import { createSupabaseServerClient } from '@/lib/supabase/server'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Order {
  id: number
  created_at: string
  total_price: number
  status: string
  user_id: string
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    case 'shipped':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getStatusText(status: string) {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'Pending'
    case 'completed':
      return 'Completed'
    case 'cancelled':
      return 'Cancelled'
    case 'shipped':
      return 'Shipped'
    default:
      return status
  }
}

export default async function OrdersPage() {
  const supabase = await createSupabaseServerClient()

  // First, let's try to fetch orders without the join to see if the table exists
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error)
    console.error('Error details:', JSON.stringify(error, null, 2))
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Order Management</h2>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                An error occurred while loading orders.
              </p>
              <p className="text-sm text-red-600">
                Error: {error.message || 'Unexpected error'}
              </p>
              <p className="text-xs text-muted-foreground">
               An error occurred while loading orders. If you see this error, 
               the orders table may not have been created yet.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const typedOrders = orders as Order[] || []

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Order Management</h2>
        <div className="text-sm text-muted-foreground">
          Total {typedOrders.length} order
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {typedOrders.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              There are no orders yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>History</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {typedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      #{order.id}
                    </TableCell>
                    <TableCell>
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
                    <TableCell className="text-right font-medium">
                    ${order.total_price.toFixed(2)}
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