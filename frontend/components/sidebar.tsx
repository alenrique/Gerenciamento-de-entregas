"use client"

import {
  Home,
  Users,
  Briefcase,
  FileText,
  PieChart,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Sidebar() {

  const menuItems = [
    { icon: <Home size={18} />, label: "Dashboard", link: "/dashboard" },
    { icon: <Users size={18} />, label: "Clientes", link: "/clients" },
    { icon: <FileText size={18} />, label: "Cadastro de entregas", link: "/delivery_registration" },
    { icon: <Briefcase size={18} />, label: "Entregas", link: "/deliveries" },
    { icon: <PieChart size={18} />, label: "Estatísticas", link: "/statistics" },
  ];

  const pathName = usePathname()

  return (
    <aside className="w-64 bg-gray-800 text-white hidden md:block">
      <div className="p-4 border-b border-gray-700">
        <Image src={"/logo.png"} alt="Logo" width={127} height={127} />
      </div>
      <nav className="mt-2">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <a
                href={item.link}
                className={`flex items-center px-4 py-2.5 text-sm cursor-pointer ${
                  pathName === item.link ? "bg-teal-500 text-white" : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="absolute bottom-0 w-64 p-4 bg-gray-900 text-xs text-gray-400">
        <p>Administrativo</p>
      </div>
    </aside>
  );
}
