import { Sidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { PlatformPerformance } from "@/components/admin/platform-performance"
import { RecentBookings } from "@/components/admin/recent-bookings"
import { InsightsPanel } from "@/components/admin/insights-panel"

export default function AdminDashboard() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Stats Overview */}
            <DashboardStats />

            {/* Revenue Chart */}
            <RevenueChart />

            {/* Platform Performance */}
            <PlatformPerformance />

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentBookings />
              <InsightsPanel />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}