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
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <Link href="/admin" className="flex items-center space-x-2">
          <Home className="h-8 w-8 text-primary" />
          <span className="font-bold text-lg text-gray-900">
            Admin Panel
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-700 hover:text-red-600"
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