"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { mockPlatformMetrics } from "@/lib/mock-data"

export function PlatformPerformance() {
  // Aggregate today's data by platform
  const todayData = mockPlatformMetrics
    .filter(m => m.date === "2025-01-20")
    .map(metric => ({
      platform: metric.platform,
      views: metric.views,
      clicks: metric.clicks,
      bookings: metric.bookings,
      ctr: ((metric.clicks / metric.views) * 100).toFixed(1),
      conversionRate: ((metric.bookings / metric.clicks) * 100).toFixed(1),
    }))

  const platformNames = {
    AIRBNB: "Airbnb",
    BOOKING: "Booking.com", 
    DIRECT: "Sito Diretto"
  }

  const chartData = todayData.map(item => ({
    ...item,
    platformName: platformNames[item.platform as keyof typeof platformNames]
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Views vs Clicks Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Visualizzazioni vs Click</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="platformName" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="views" fill="#8884d8" name="Visualizzazioni" />
                <Bar dataKey="clicks" fill="#82ca9d" name="Click" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Platform Stats Table */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Oggi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {chartData.map((platform, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">{platform.platformName}</h3>
                  <span className="text-sm text-muted-foreground">
                    CTR: {platform.ctr}%
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Visualizzazioni</p>
                    <p className="font-semibold">{platform.views.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Click</p>
                    <p className="font-semibold">{platform.clicks}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Prenotazioni</p>
                    <p className="font-semibold">{platform.bookings}</p>
                  </div>
                </div>
                
                <div className="mt-2 pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tasso di Conversione:</span>
                    <span className="font-semibold">{platform.conversionRate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}