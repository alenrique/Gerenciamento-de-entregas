"use client"

import { X, MapPin, Package, User, Phone, Mail, CreditCard } from "lucide-react"

// Interfaces para os dados da API
interface ClienteAPI {
  id: number
  nome: string
  cpf: string
  email: string
  telefone: string
}

// Interface para os dados combinados
interface EntregaCombinada {
  id: number
  peso: number
  endereco: {
    completo: string
    logradouro: string
    numero: string
    bairro: string
    complemento: string
    cidade: string
    estado: string
    pais: string
    latitude: number
    longitude: number
  }
  cliente: ClienteAPI | null
}

interface EntregaDetailModalProps {
  entrega: EntregaCombinada
  isOpen: boolean
  onClose: () => void
}

export default function EntregaDetailModal({ entrega, isOpen, onClose }: EntregaDetailModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-gray-800">Detalhes da Entrega #{entrega.id}</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informações da Entrega */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                  <Package size={20} className="mr-2 text-teal-500" />
                  Informações da Entrega
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex">
                    <span className="text-gray-500 w-28">ID:</span>
                    <span className="font-medium">{entrega.id}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-28">Peso:</span>
                    <span>{entrega.peso} kg</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                  <User size={20} className="mr-2 text-teal-500" />
                  Informações do Cliente
                </h3>
                {entrega.cliente ? (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex">
                      <span className="text-gray-500 w-28">Nome:</span>
                      <span className="font-medium">{entrega.cliente.nome}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-28">Telefone:</span>
                      <span className="flex items-center">
                        <Phone size={16} className="mr-1 text-gray-400" />
                        {entrega.cliente.telefone}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-28">Email:</span>
                      <span className="flex items-center">
                        <Mail size={16} className="mr-1 text-gray-400" />
                        {entrega.cliente.email}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-28">CPF:</span>
                      <span className="flex items-center">
                        <CreditCard size={16} className="mr-1 text-gray-400" />
                        {entrega.cliente.cpf}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-28">ID do Cliente:</span>
                      <span>{entrega.cliente.id}</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 text-gray-500">
                    Cliente não encontrado ou não associado a esta entrega.
                  </div>
                )}
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                  <MapPin size={20} className="mr-2 text-teal-500" />
                  Endereço de Entrega
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex">
                    <span className="text-gray-500 w-28">Endereço:</span>
                    <span>{entrega.endereco.completo}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-28">Logradouro:</span>
                    <span>
                      {entrega.endereco.logradouro}, {entrega.endereco.numero}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-28">Bairro:</span>
                    <span>{entrega.endereco.bairro}</span>
                  </div>
                  {entrega.endereco.complemento && (
                    <div className="flex">
                      <span className="text-gray-500 w-28">Complemento:</span>
                      <span>{entrega.endereco.complemento}</span>
                    </div>
                  )}
                  <div className="flex">
                    <span className="text-gray-500 w-28">Cidade/Estado:</span>
                    <span>
                      {entrega.endereco.cidade}, {entrega.endereco.estado}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-28">País:</span>
                    <span>{entrega.endereco.pais}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-28">Coordenadas:</span>
                    <span>
                      {entrega.endereco.latitude.toFixed(6)}, {entrega.endereco.longitude.toFixed(6)}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="h-40 bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-gray-500 text-sm">Mapa indisponível</span>
                    </div>
                  </div>
                </div>
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
        </div>
      </div>
    </div>
  )
}

