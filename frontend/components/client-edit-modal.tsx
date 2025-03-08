"use client"

import type React from "react"

import { useState } from "react"
import { X, Mail, Phone, User, CreditCard, Save, Loader } from "lucide-react"

// Interface para os dados do cliente da API
interface ClienteAPI {
  id: number
  nome: string
  cpf: string
  email: string
  telefone: string
}

interface ClientEditModalProps {
  client: ClienteAPI
  isOpen: boolean
  onClose: () => void
  onClientUpdated: (updatedClient: ClienteAPI) => void
}

export default function ClientEditModal({ client, isOpen, onClose, onClientUpdated }: ClientEditModalProps) {
  const [formData, setFormData] = useState<ClienteAPI>({ ...client })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Enviar requisição PUT para a API
      const response = await fetch(`http://localhost:8080/clients/${client.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`Erro ao atualizar cliente: ${response.status}`)
      }

      const updatedClient = await response.json()

      // Notificar o componente pai sobre a atualização
      onClientUpdated(updatedClient)

      // Fechar o modal
      onClose()
    } catch (err) {
      console.error("Erro ao atualizar cliente:", err)
      setError(err instanceof Error ? err.message : "Ocorreu um erro ao atualizar o cliente")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Editar Cliente</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo*</label>
                  <div className="flex items-center">
                    <User className="text-gray-400 mr-2" size={18} />
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF/CNPJ*</label>
                  <div className="flex items-center">
                    <CreditCard className="text-gray-400 mr-2" size={18} />
                    <input
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                  <div className="flex items-center">
                    <Mail className="text-gray-400 mr-2" size={18} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone*</label>
                  <div className="flex items-center">
                    <Phone className="text-gray-400 mr-2" size={18} />
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 p-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

