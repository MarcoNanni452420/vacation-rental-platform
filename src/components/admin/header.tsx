"use client"

import { useSession } from "next-auth/react"
import { Bell, User, Calendar, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function AdminHeader() {
  const { data: session } = useSession()

  return (
    <header className="bg-white border-b border-border px-8 py-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Dashboard Casa Fienaroli
          </h1>
          <div className="flex items-center gap-4">
            <p className="text-lg text-muted-foreground">
              Benvenuto, {session?.user?.name || session?.user?.email}
            </p>
            <Badge variant="secondary" className="uppercase tracking-wider">
              {session?.user?.role}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Quick Stats */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Oggi: 3 check-in</span>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span>€1,350 ricavi</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs text-primary-foreground font-medium">2</span>
              </span>
            </Button>

            {/* User Profile */}
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}