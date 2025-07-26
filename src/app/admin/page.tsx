import { Sidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { PlatformPerformance } from "@/components/admin/platform-performance"
import { RecentBookings } from "@/components/admin/recent-bookings"
import { InsightsPanel } from "@/components/admin/insights-panel"

export default function AdminDashboard() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 flex-shrink-0 bg-white border-r border-border">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-8 space-y-8">
            {/* Stats Overview */}
            <section>
              <DashboardStats />
            </section>

            {/* Main Charts Grid */}
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <RevenueChart />
              </div>
              <div>
                <PlatformPerformance />
              </div>
            </section>

            {/* Recent Activity */}
            <section>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <RecentBookings />
                <InsightsPanel />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}