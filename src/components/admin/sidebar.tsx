"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Home, 
  Calendar, 
  TrendingUp, 
  Settings,
  LogOut,
  Building2,
  Users,
  MessageSquare
} from "lucide-react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Proprietà",
    href: "/admin/properties",
    icon: Building2,
  },
  {
    name: "Prenotazioni",
    href: "/admin/bookings",
    icon: Calendar,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: TrendingUp,
  },
  {
    name: "Ospiti",
    href: "/admin/guests",
    icon: Users,
  },
  {
    name: "Recensioni",
    href: "/admin/reviews",
    icon: MessageSquare,
  },
  {
    name: "Impostazioni",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center h-20 px-8 border-b border-border">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Home className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <div className="font-bold text-lg text-foreground">
              Casa Fienaroli
            </div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Admin Panel
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 py-8 space-y-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-gray-100 hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-6 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-xl px-4 py-3"
          onClick={() => signOut()}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
        
        <div className="mt-2 pt-2 border-t border-gray-100">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href="/">
              Torna al Sito
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}