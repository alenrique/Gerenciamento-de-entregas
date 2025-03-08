"use client"

import { X, Mail, Phone, User, CreditCard } from "lucide-react"

// Interface para os dados do cliente da API
interface ClienteAPI {
  id: number
  nome: string
  cpf: string
  email: string
  telefone: string
}

interface ClientDetailModalProps {
  client: ClienteAPI
  isOpen: boolean
  onClose: () => void
}

export default function ClientDetailModal({ client, isOpen, onClose }: ClientDetailModalProps) {
  if (!isOpen) return null

  // Determinar a categoria do cliente com base no CPF/CNPJ
  const getClientCategory = (cpf: string): string => {
    // Se o CPF tiver formato de CNPJ (14 dígitos sem formatação ou com formatação de CNPJ)
    if (cpf.replace(/\D/g, "").length > 11 || cpf.includes("/")) {
      return "Pessoa Jurídica"
    }
    return "Pessoa Física"
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Detalhes do Cliente</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="h-24 w-24 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="text-teal-600 text-3xl font-medium">{client.nome.charAt(0)}</span>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{client.nome}</h3>
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-4">
                {getClientCategory(client.cpf)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-start">
                  <Mail className="text-gray-400 mr-2 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800">{client.email}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="text-gray-400 mr-2 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Telefone</p>
                    <p className="text-gray-800">{client.telefone}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CreditCard className="text-gray-400 mr-2 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">CPF/CNPJ</p>
                    <p className="text-gray-800">{client.cpf}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <User className="text-gray-400 mr-2 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">ID do Cliente</p>
                    <p className="text-gray-800">{client.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t pt-6">
            <h4 className="text-lg font-medium text-gray-800 mb-4">Histórico de Entregas</h4>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-center h-24 text-gray-500">
                Este cliente ainda não possui entregas registradas.
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Fechar
          </button>
          <button className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600">Editar Cliente</button>
        </div>
      </div>
    </div>
  )
}

