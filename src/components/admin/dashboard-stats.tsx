"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockPlatformMetrics, mockAdCampaigns, formatCurrency } from "@/lib/mock-data"
import { TrendingUp, TrendingDown, Eye, MousePointer, Calendar, Euro } from "lucide-react"

export function DashboardStats() {
  // Calculate totals from mock data
  const todayMetrics = mockPlatformMetrics.filter(m => m.date === "2025-01-20")
  const yesterdayMetrics = mockPlatformMetrics.filter(m => m.date === "2025-01-19")

  const totalViews = todayMetrics.reduce((sum, m) => sum + m.views, 0)
  const totalClicks = todayMetrics.reduce((sum, m) => sum + m.clicks, 0)
  const totalBookings = todayMetrics.reduce((sum, m) => sum + m.bookings, 0)
  const totalRevenue = todayMetrics.reduce((sum, m) => sum + m.revenue, 0)

  const yesterdayViews = yesterdayMetrics.reduce((sum, m) => sum + m.views, 0)
  const yesterdayClicks = yesterdayMetrics.reduce((sum, m) => sum + m.clicks, 0)
  const yesterdayBookings = yesterdayMetrics.reduce((sum, m) => sum + m.bookings, 0)
  const yesterdayRevenue = yesterdayMetrics.reduce((sum, m) => sum + m.revenue, 0)

  const viewsChange = ((totalViews - yesterdayViews) / yesterdayViews * 100).toFixed(1)
  const clicksChange = ((totalClicks - yesterdayClicks) / yesterdayClicks * 100).toFixed(1)
  const bookingsChange = ((totalBookings - yesterdayBookings) / yesterdayBookings * 100).toFixed(1)
  const revenueChange = ((totalRevenue - yesterdayRevenue) / yesterdayRevenue * 100).toFixed(1)

  const totalAdSpend = mockAdCampaigns.reduce((sum, c) => sum + c.spend, 0)
  const ctr = ((totalClicks / totalViews) * 100).toFixed(2)

  const stats = [
    {
      title: "Visualizzazioni Totali",
      value: totalViews.toLocaleString(),
      change: viewsChange,
      icon: Eye,
      positive: parseFloat(viewsChange) >= 0,
    },
    {
      title: "Click Totali",
      value: totalClicks.toLocaleString(),
      change: clicksChange,
      icon: MousePointer,
      positive: parseFloat(clicksChange) >= 0,
    },
    {
      title: "Prenotazioni",
      value: totalBookings.toString(),
      change: bookingsChange,
      icon: Calendar,
      positive: parseFloat(bookingsChange) >= 0,
    },
    {
      title: "Ricavi Oggi",
      value: formatCurrency(totalRevenue),
      change: revenueChange,
      icon: Euro,
      positive: parseFloat(revenueChange) >= 0,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stat.positive ? (
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              )}
              <span className={stat.positive ? "text-green-500" : "text-red-500"}>
                {stat.positive ? "+" : ""}{stat.change}%
              </span>
              <span className="ml-1">da ieri</span>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Additional metrics */}
      <Card className="md:col-span-2 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Metriche Aggiuntive
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">CTR Medio</span>
            <span className="font-semibold">{ctr}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Spesa Pubblicitaria</span>
            <span className="font-semibold">{formatCurrency(totalAdSpend)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Conversioni</span>
            <span className="font-semibold">
              {mockAdCampaigns.reduce((sum, c) => sum + c.conversions, 0)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">ROAS</span>
            <span className="font-semibold text-green-600">
              {(totalRevenue / totalAdSpend).toFixed(2)}x
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}