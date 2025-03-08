"use client"

import { useState } from "react"
import { X } from "lucide-react"

export default function ClientRegistrationForm() {
  const [activeTab, setActiveTab] = useState("geral")

  return (
    <div className="bg-white rounded-md shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">CADASTRO DE CLIENTES</h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-2 text-sm font-medium flex items-center ${
            activeTab === "geral" ? "text-teal-500 border-b-2 border-teal-500" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("geral")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          Geral
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium flex items-center ${
            activeTab === "endereco" ? "text-teal-500 border-b-2 border-teal-500" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("endereco")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Endereço
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium flex items-center ${
            activeTab === "banco" ? "text-teal-500 border-b-2 border-teal-500" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("banco")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1"
          >
            <path d="M2 20h20" />
            <path d="M12 4v9.5" />
            <path d="m4.93 10.93 1.41 1.41" />
            <path d="M2 13.5h6" />
            <path d="m19.07 10.93-1.41 1.41" />
            <path d="M16 13.5h6" />
            <path d="M12 13.5V20" />
          </svg>
          Banco
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium flex items-center ${
            activeTab === "cadastro" ? "text-teal-500 border-b-2 border-teal-500" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("cadastro")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Cadastro de Cliente
        </button>
      </div>

      {/* Form Content */}
      <div className="p-4">
        {activeTab === "geral" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome*</label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                  <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">RG</label>
                  <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                  <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Nascimento</label>
                <input type="date" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria*</label>
                <div className="flex">
                  <select className="w-full border border-gray-300 rounded-l-md px-3 py-2 text-sm">
                    <option>Selecionar...</option>
                  </select>
                  <button className="bg-teal-500 text-white px-3 py-2 rounded-r-md">+</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-2">
                <div className="flex-none w-24">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                    <option>Celular</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">&nbsp;</label>
                  <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observação</label>
                  <div className="flex">
                    <input type="text" className="w-full border border-gray-300 rounded-l-md px-3 py-2 text-sm" />
                    <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r-md">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="flex-none w-24">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                    <option>Email</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">&nbsp;</label>
                  <input type="email" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observação</label>
                  <div className="flex">
                    <input type="text" className="w-full border border-gray-300 rounded-l-md px-3 py-2 text-sm" />
                    <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r-md">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <div className="flex-none w-24">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Residencial</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                    <option>Residencial</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">&nbsp;</label>
                  <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                  <div className="flex">
                    <input type="text" className="w-full border border-gray-300 rounded-l-md px-3 py-2 text-sm" />
                    <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded-r-md">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "endereco" && <div className="py-8 text-center text-gray-500">Conteúdo da aba Endereço</div>}

        {activeTab === "banco" && <div className="py-8 text-center text-gray-500">Conteúdo da aba Banco</div>}

        {activeTab === "cadastro" && (
          <div className="py-8 text-center text-gray-500">Conteúdo da aba Cadastro de Cliente</div>
        )}
      </div>

      {/* Form Actions */}
      <div className="p-4 border-t border-gray-200 flex justify-between">
        <button className="bg-teal-500 text-white px-4 py-2 rounded-md text-sm">SALVAR</button>
        <button className="bg-red-500 text-white px-4 py-2 rounded-md text-sm">EXCLUIR CLIENTE</button>
      </div>
    </div>
  )
}

