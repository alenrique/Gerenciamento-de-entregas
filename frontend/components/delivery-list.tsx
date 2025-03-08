"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Download, Upload, Eye, Edit, Trash2, MapPin, Loader } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import EntregaDetailModal from "./delivery-detail-modal"
// Adicionar o import do modal de edição
import EntregaEditModal from "./delivery-edit-modal"

// Interfaces para os dados da API
interface ClienteAPI {
  id: number
  nome: string
  cpf: string
  email: string
  telefone: string
}

interface EntregaAPI {
  id: number
  cliente_id: number
  peso: number
  endereco: string
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

export default function EntregasList() {
  const [entregas, setEntregas] = useState<EntregaCombinada[]>([])
  const [clientes, setClientes] = useState<ClienteAPI[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEntrega, setSelectedEntrega] = useState<EntregaCombinada | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  // Adicionar estado para controlar o modal de edição
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Buscar dados das APIs
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Buscar clientes
        const clientesResponse = await fetch("http://localhost:8080/clients")
        if (!clientesResponse.ok) {
          throw new Error("Falha ao buscar dados de clientes")
        }
        const clientesData: ClienteAPI[] = await clientesResponse.json()
        setClientes(clientesData)

        // Buscar entregas
        const entregasResponse = await fetch("http://localhost:8080/deliveries")
        if (!entregasResponse.ok) {
          throw new Error("Falha ao buscar dados de entregas")
        }
        const entregasData: EntregaAPI[] = await entregasResponse.json()

        // Combinar dados
        const entregasCombinadas: EntregaCombinada[] = entregasData.map((entrega) => {
          const clienteRelacionado = clientesData.find((cliente) => cliente.id === entrega.cliente_id) || null

          return {
            id: entrega.id,
            peso: entrega.peso,
            endereco: {
              completo: entrega.endereco,
              logradouro: entrega.logradouro,
              numero: entrega.numero,
              bairro: entrega.bairro,
              complemento: entrega.complemento,
              cidade: entrega.cidade,
              estado: entrega.estado,
              pais: entrega.pais,
              latitude: entrega.latitude,
              longitude: entrega.longitude,
            },
            cliente: clienteRelacionado,
          }
        })

        setEntregas(entregasCombinadas)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ocorreu um erro ao buscar os dados")
        console.error("Erro ao buscar dados:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filtrar entregas com base na pesquisa
  const filteredEntregas = entregas.filter((entrega) => {
    const matchesSearch =
      entrega.id.toString().includes(searchTerm.toLowerCase()) ||
      (entrega.cliente?.nome.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      `${entrega.endereco.cidade} ${entrega.endereco.estado}`.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  // Função para abrir o modal de detalhes
  const openDetailModal = (entrega: EntregaCombinada) => {
    setSelectedEntrega(entrega)
    setIsDetailModalOpen(true)
  }

  // Adicionar função para abrir o modal de edição
  const openEditModal = (entrega: EntregaCombinada) => {
    setSelectedEntrega(entrega)
    setIsEditModalOpen(true)
  }

  // Adicionar função para atualizar a entrega na lista
  const handleEntregaUpdated = (updatedEntrega: EntregaCombinada) => {
    setEntregas((prevEntregas) =>
      prevEntregas.map((entrega) => (entrega.id === updatedEntrega.id ? updatedEntrega : entrega)),
    )
  }

  // Função para excluir uma entrega
  const deleteEntrega = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta entrega?")) {
      try {
        // Aqui você implementaria a chamada para excluir a entrega na API
        const response = await fetch(`http://localhost:8080/deliveries/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })
        // Por enquanto, apenas atualizamos o estado local
        setEntregas(entregas.filter((entrega) => entrega.id !== id))
      } catch (err) {
        console.error("Erro ao excluir entrega:", err)
        alert("Ocorreu um erro ao excluir a entrega")
      }
    }
  }

  return (
    <div className="flex-1 p-4 md:p-8 overflow-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Entregas</h1>
          <p className="text-gray-500 mt-1">Gerencie todas as suas entregas em um só lugar</p>
        </div>
        <a href="/delivery_registration" className="mt-4 md:mt-0 bg-teal-500 text-white px-4 py-2 rounded-md flex items-center">
          <Plus size={18} className="mr-2" />
          Nova Entrega
        </a>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar por ID, cliente ou cidade..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader className="animate-spin h-8 w-8 text-teal-500 mr-2" />
            <span>Carregando entregas...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">
            <p>Erro ao carregar dados: {error}</p>
            <button
              className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Endereço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Peso
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEntregas.length > 0 ? (
                  filteredEntregas.map((entrega) => (
                    <tr key={entrega.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entrega.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {entrega.cliente?.nome || "Cliente não encontrado"}
                        </div>
                        <div className="text-sm text-gray-500">{entrega.cliente?.telefone || "Sem telefone"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-start">
                          <MapPin size={16} className="text-gray-400 mt-0.5 mr-1 flex-shrink-0" />
                          <div>
                            <div className="text-sm text-gray-900">
                              {entrega.endereco.logradouro}, {entrega.endereco.numero}
                            </div>
                            <div className="text-sm text-gray-500">
                              {entrega.endereco.cidade}, {entrega.endereco.estado}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entrega.peso} kg</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => openDetailModal(entrega)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Ver detalhes"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => openEditModal(entrega)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => deleteEntrega(entrega.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      {searchTerm ? "Nenhuma entrega encontrada com os filtros atuais." : "Nenhuma entrega cadastrada."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && !error && (
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Mostrando <span className="font-medium">{filteredEntregas.length}</span> de{" "}
              <span className="font-medium">{entregas.length}</span> entregas
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-50">
                Anterior
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700 hover:bg-gray-50">
                Próximo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de detalhes da entrega */}
      {isDetailModalOpen && selectedEntrega && (
        <EntregaDetailModal
          entrega={selectedEntrega}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}
      {isEditModalOpen && selectedEntrega && (
        <EntregaEditModal
          entrega={selectedEntrega}
          clientes={clientes}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEntregaUpdated={handleEntregaUpdated}
        />
      )}
    </div>
  )
}

