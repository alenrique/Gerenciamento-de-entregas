import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import ClientList from "@/components/client-list"

export default function ClientesPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <ClientList />
      </div>
    </div>
  )
}

