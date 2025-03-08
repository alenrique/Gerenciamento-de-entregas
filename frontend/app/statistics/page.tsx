import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import Statistics from "@/components/statistics"

export default function StatisticsPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <Statistics />
      </div>
    </div>
  )
}

