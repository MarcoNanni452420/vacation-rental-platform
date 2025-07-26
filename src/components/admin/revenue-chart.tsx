"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { mockPlatformMetrics, formatCurrency } from "@/lib/mock-data"

export function RevenueChart() {
  // Group data by date and aggregate by platform
  const chartData = mockPlatformMetrics.reduce((acc, metric) => {
    const existingDate = acc.find(item => item.date === metric.date)
    
    if (existingDate) {
      existingDate[metric.platform] = metric.revenue / 100 // Convert to euros
      existingDate.total = (existingDate.total as number) + (metric.revenue / 100)
    } else {
      acc.push({
        date: metric.date,
        [metric.platform]: metric.revenue / 100,
        total: metric.revenue / 100,
      })
    }
    
    return acc
  }, [] as Array<{date: string; total: number; [key: string]: string | number}>)

  // Sort by date
  chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Format dates for display
  const formattedData = chartData.map(item => ({
    ...item,
    date: new Intl.DateTimeFormat('it-IT', { 
      day: 'numeric', 
      month: 'short' 
    }).format(new Date(item.date))
  }))

  const formatTooltipValue = (value: number) => formatCurrency(value * 100)

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Ricavi per Piattaforma</CardTitle>
        <CardDescription>
          Confronto dei ricavi giornalieri dalle diverse piattaforme
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `€${value}`}
              />
              <Tooltip 
                formatter={formatTooltipValue}
                labelFormatter={(label) => `Data: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="AIRBNB" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Airbnb"
              />
              <Line 
                type="monotone" 
                dataKey="BOOKING" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Booking.com"
              />
              <Line 
                type="monotone" 
                dataKey="DIRECT" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Sito Diretto"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}