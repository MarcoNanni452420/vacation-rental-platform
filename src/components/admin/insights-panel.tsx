"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { mockInsights } from "@/lib/mock-data"
import { AlertCircle, CheckCircle, Info, TrendingUp } from "lucide-react"

const iconMap = {
  success: CheckCircle,
  warning: AlertCircle,
  info: Info,
}

const colorMap = {
  success: "text-green-600 bg-green-100",
  warning: "text-yellow-600 bg-yellow-100", 
  info: "text-blue-600 bg-blue-100",
}

export function InsightsPanel() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <CardTitle>Consigli Intelligenti</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockInsights.map((insight, index) => {
          const Icon = iconMap[insight.type as keyof typeof iconMap]
          const colorClass = colorMap[insight.type as keyof typeof colorMap]
          
          return (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${colorClass}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{insight.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {insight.message}
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-md p-3">
                <p className="text-sm font-medium text-gray-700">
                  💡 Azione consigliata:
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {insight.action}
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  Maggiori Dettagli
                </Button>
                <Button size="sm" variant="ghost">
                  Nascondi
                </Button>
              </div>
            </div>
          )
        })}
        
        <div className="text-center pt-4">
          <Button variant="outline" className="w-full">
            Vedi Tutti i Consigli
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}