"use client"

import type React from "react"

import { useState } from "react"
import { X, Package, Save, Loader, Search } from "lucide-react"

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

interface EntregaEditModalProps {
  entrega: EntregaCombinada
  clientes: ClienteAPI[]
  isOpen: boolean
  onClose: () => void
  onEntregaUpdated: (updatedEntrega: EntregaCombinada) => void
}

export default function EntregaEditModal({
  entrega,
  clientes,
  isOpen,
  onClose,
  onEntregaUpdated,
}: EntregaEditModalProps) {
  const [formData, setFormData] = useState({
    id: entrega.id,
    peso: entrega.peso,
    cliente_id: entrega.cliente?.id || 0,
    endereco: entrega.endereco.completo,
    logradouro: entrega.endereco.logradouro,
    numero: entrega.endereco.numero,
    bairro: entrega.endereco.bairro,
    complemento: entrega.endereco.complemento || "",
    cidade: entrega.endereco.cidade,
    estado: entrega.endereco.estado,
    pais: entrega.endereco.pais,
    latitude: entrega.endereco.latitude,
    longitude: entrega.endereco.longitude,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSearchingAddress, setIsSearchingAddress] = useState(false)

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Converter o campo "peso" para float
    if (name === "peso") {
        setFormData((prev) => ({
            ...prev,
            [name]: parseFloat(value), // Converte para float
        }));
    } else {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
};

  const searchAddress = async () => {
    if (!formData.endereco) return

    setIsSearchingAddress(true)

    try {
      // Simular busca de endereço na API
      const response = await fetch("/api/geocode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: formData.endereco }),
      })

      const result = await response.json()

      if (result.success) {
        setFormData((prev) => ({
          ...prev,
          logradouro: result.data.logradouro,
          numero: result.data.numero,
          bairro: result.data.bairro,
          cidade: result.data.cidade,
          estado: result.data.estado,
          pais: result.data.pais,
          latitude: result.data.latitude,
          longitude: result.data.longitude,
        }))
      } else {
        setError("Não foi possível encontrar o endereço")
      }
    } catch (err) {
      setError("Erro ao buscar endereço")
      console.error("Erro ao buscar endereço:", err)
    } finally {
      setIsSearchingAddress(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Enviar requisição PUT para a API
      console.log(JSON.stringify(formData))
      const response = await fetch(`http://localhost:8080/deliveries/${entrega.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`Erro ao atualizar entrega: ${response.status}`)
      }

      const updatedEntregaData = await response.json()

      // Converter para o formato EntregaCombinada
      const clienteRelacionado = clientes.find((c) => c.id === formData.cliente_id) || null

      const updatedEntrega: EntregaCombinada = {
        id: updatedEntregaData.id,
        peso: updatedEntregaData.peso,
        endereco: {
          completo: updatedEntregaData.endereco,
          logradouro: updatedEntregaData.logradouro,
          numero: updatedEntregaData.numero,
          bairro: updatedEntregaData.bairro,
          complemento: updatedEntregaData.complemento,
          cidade: updatedEntregaData.cidade,
          estado: updatedEntregaData.estado,
          pais: updatedEntregaData.pais,
          latitude: updatedEntregaData.latitude,
          longitude: updatedEntregaData.longitude,
        },
        cliente: clienteRelacionado,
      }

      // Notificar o componente pai sobre a atualização
      onEntregaUpdated(updatedEntrega)

      // Fechar o modal
      onClose()
    } catch (err) {
      console.error("Erro ao atualizar entrega:", err)
      setError(err instanceof Error ? err.message : "Ocorreu um erro ao atualizar a entrega")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Editar Entrega #{entrega.id}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Informações Básicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)*</label>
                    <div className="flex items-center">
                      <Package className="text-gray-400 mr-2" size={18} />
                      <input
                        type="number"
                        step="0.01"
                        name="peso"
                        value={formData.peso}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cliente*</label>
                    <select
                      name="cliente_id"
                      value={formData.cliente_id}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    >
                      <option value="">Selecione um cliente</option>
                      {clientes.map((cliente) => (
                        <option key={cliente.id} value={cliente.id}>
                          {cliente.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Endereço de Entrega</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo*</label>
                    <div className="flex">
                      <input
                        type="text"
                        name="endereco"
                        value={formData.endereco}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={searchAddress}
                        disabled={isSearchingAddress}
                        className="bg-teal-500 text-white px-3 py-2 rounded-r-md flex items-center"
                      >
                        {isSearchingAddress ? <Loader className="animate-spin h-4 w-4" /> : <Search size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Logradouro</label>
                      <input
                        type="text"
                        name="logradouro"
                        value={formData.logradouro}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                      <input
                        type="text"
                        name="numero"
                        value={formData.numero}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                      <input
                        type="text"
                        name="bairro"
                        value={formData.bairro}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                      <input
                        type="text"
                        name="complemento"
                        value={formData.complemento}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                      <input
                        type="text"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                      <input
                        type="text"
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                      <input
                        type="text"
                        name="pais"
                        value={formData.pais}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                      <input
                        type="text"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                      <input
                        type="text"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
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

