import { createSupabaseServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package 
} from 'lucide-react'
import { SalesChart } from '@/components/admin/SalesChart'
import { RecentOrders } from '@/components/admin/RecentOrders'

// StatCard Component
interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  description?: string
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

export default async function AdminDashboard() {
  const supabase = await createSupabaseServerClient()

  // Concurrent data fetching for performance
  const [statsData, chartData, recentOrdersData] = await Promise.all([
    // Query 1: Aggregate statistics
    Promise.all([
      // Total revenue
      supabase
        .from('orders')
        .select('total_price')
        .then(({ data, error }) => {
          if (error) return 0
          return data?.reduce((sum, order) => sum + (order.total_price || 0), 0) || 0
        }),
      
      // Total sales (order count)
      supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .then(({ count, error }) => error ? 0 : count || 0),
      
      // Total products
      supabase
        .from('fruits')
        .select('id', { count: 'exact', head: true })
        .then(({ count, error }) => error ? 0 : count || 0),
      
      // Total customers (unique users from orders)
      supabase
        .from('orders')
        .select('user_id')
        .then(({ data, error }) => {
          if (error) return 0
          const uniqueUsers = new Set(data?.map(order => order.user_id))
          return uniqueUsers.size
        })
    ]),

    // Query 2: Chart data - sales by month
    supabase
      .from('orders')
      .select('created_at, total_price')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error || !data) return []
        
        // Group by month
        const monthlyData: { [key: string]: number } = {}
        
        data.forEach(order => {
          const date = new Date(order.created_at)
          const monthKey = date.toLocaleDateString('tr-TR', { 
            year: 'numeric', 
            month: 'long' 
          })
          
          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = 0
          }
          monthlyData[monthKey] += order.total_price || 0
        })
        
        return Object.entries(monthlyData).map(([name, total]) => ({
          name,
          total: Math.round(total * 100) / 100
        }))
      }),

    // Query 3: Recent orders
    supabase
      .from('orders')
      .select(`
        id,
        created_at,
        total_price,
        status,
        user_id
      `)
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data, error }) => error ? [] : data || [])
  ])

  const [totalRevenue, totalSales, totalProducts, totalCustomers] = statsData

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
      </div>
      
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Income"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          description="Total revenue from all orders"
        />
        <StatCard
          title="Total Sales"
          value={totalSales}
          icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
          description="Number of completed orders"
        />
        <StatCard
          title="Total Customers"
          value={totalCustomers}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description=" Number of unique customers placing orders"
        />
        <StatCard
          title="Total Product"
          value={totalProducts}
          icon={<Package className="h-4 w-4 text-muted-foreground" />}
          description="Total number of products in the catalog"
        />
      </div>

      {/* Charts and Recent Orders Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Monthly Sales Graph</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <SalesChart data={chartData} />
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Latest Orders </CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrders orders={recentOrdersData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
