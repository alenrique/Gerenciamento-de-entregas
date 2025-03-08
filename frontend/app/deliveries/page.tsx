import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import EntregasList from "@/components/delivery-list"

export default function EntregasPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <EntregasList />
      </div>
    </div>
  )
}

