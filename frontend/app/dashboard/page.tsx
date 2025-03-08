import Dashboard from "@/components/dashboard"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <Dashboard />
      </div>
    </div>
  )
}

