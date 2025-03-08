import DeliveryRegistrationForm from "@/components/delivery-registration-form";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

export default function DeliveryRegistration() {
    return (
        <div className="flex h-screen bg-gray-100">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-4">
              <DeliveryRegistrationForm />
            </main>
          </div>
        </div>
      )
}