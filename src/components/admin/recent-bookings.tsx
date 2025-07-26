"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockRecentBookings, formatCurrency, formatDate } from "@/lib/mock-data"
import { Calendar, Users, MapPin } from "lucide-react"

const statusColors = {
  CONFIRMED: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800", 
  CANCELLED: "bg-red-100 text-red-800",
  COMPLETED: "bg-blue-100 text-blue-800",
}

const platformColors = {
  AIRBNB: "bg-red-100 text-red-800",
  BOOKING: "bg-blue-100 text-blue-800",
  DIRECT: "bg-green-100 text-green-800",
}

export function RecentBookings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prenotazioni Recenti</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockRecentBookings.map((booking) => (
          <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg">{booking.guestName}</h3>
                <p className="text-muted-foreground">{booking.propertyTitle}</p>
              </div>
              <div className="flex space-x-2">
                <Badge className={statusColors[booking.status as keyof typeof statusColors]}>
                  {booking.status === "CONFIRMED" && "Confermata"}
                  {booking.status === "PENDING" && "In Attesa"}
                  {booking.status === "CANCELLED" && "Cancellata"}
                  {booking.status === "COMPLETED" && "Completata"}
                </Badge>
                <Badge className={platformColors[booking.platform as keyof typeof platformColors]}>
                  {booking.platform === "AIRBNB" && "Airbnb"}
                  {booking.platform === "BOOKING" && "Booking"}
                  {booking.platform === "DIRECT" && "Diretto"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Check-in / Check-out</p>
                  <p className="font-medium">
                    {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Ospiti</p>
                  <p className="font-medium">{booking.guests} persone</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground">Totale</p>
                  <p className="font-semibold text-lg">{formatCurrency(booking.totalAmount)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}