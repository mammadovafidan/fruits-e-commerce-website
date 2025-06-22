'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface SalesChartProps {
  data: Array<{
    name: string
    total: number
  }>
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₺${value}`}
        />
        <Tooltip 
          formatter={(value) => [`₺${value}`, 'Toplam Satış']}
          labelStyle={{ color: '#000' }}
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '1px solid #ccc',
            borderRadius: '6px'
          }}
        />
        <Bar 
          dataKey="total" 
          fill="#adfa1d" 
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
} 