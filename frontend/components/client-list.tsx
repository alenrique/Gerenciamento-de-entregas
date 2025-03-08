"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Edit, Trash2, Eye, Loader } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import ClientDetailModal from "./client-detail-modal"
// Adicionar o import do modal de edição
import ClientEditModal from "./client-edit-modal"

// Interface para os dados do cliente da API
interface ClienteAPI {
  id: number
  nome: string
  cpf: string
  email: string
  telefone: string
}

export default function ClientList() {
  const [clients, setClients] = useState<ClienteAPI[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedClient, setSelectedClient] = useState<ClienteAPI | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  // Adicionar estado para controlar o modal de edição
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Buscar dados da API
  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch("http://localhost:8080/clients")
        if (!response.ok) {
          throw new Error("Falha ao buscar dados de clientes")
        }

        const data: ClienteAPI[] = await response.json()
        setClients(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ocorreu um erro ao buscar os dados")
        console.error("Erro ao buscar clientes:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClients()
  }, [])

  // Determinar a categoria do cliente com base no CPF/CNPJ
  const getClientCategory = (cpf: string): string => {
    // Se o CPF tiver formato de CNPJ (14 dígitos sem formatação ou com formatação de CNPJ)
    if (cpf.replace(/\D/g, "").length > 11 || cpf.includes("/")) {
      return "pessoa jurídica"
    }
    return "pessoa física"
  }

  // Filtrar clientes com base na pesquisa e categoria
  const filteredClients = clients.filter((client) => {
    const clientCategory = getClientCategory(client.cpf).toLowerCase()

    const matchesSearch =
      client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.cpf.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.telefone.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "all" || clientCategory === selectedCategory.toLowerCase()

    return matchesSearch && matchesCategory
  })

  // Função para abrir o modal de detalhes
  const openDetailModal = (client: ClienteAPI) => {
    setSelectedClient(client)
    setIsDetailModalOpen(true)
  }

  // Adicionar função para abrir o modal de edição
  const openEditModal = (client: ClienteAPI) => {
    setSelectedClient(client)
    setIsEditModalOpen(true)
  }

  // Adicionar função para atualizar o cliente na lista
  const handleClientUpdated = (updatedClient: ClienteAPI) => {
    setClients((prevClients) => prevClients.map((client) => (client.id === updatedClient.id ? updatedClient : client)))
  }

  // Função para excluir um cliente
  const deleteClient = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        // Aqui você implementaria a chamada para excluir o cliente na API
        await fetch(`http://localhost:8080/clients/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        })
        // Por enquanto, apenas atualizamos o estado local
        setClients(clients.filter((client) => client.id !== id))
      } catch (err) {
        console.error("Erro ao excluir cliente:", err)
        alert("Ocorreu um erro ao excluir o cliente")
      }
    }
  }

  return (
    <div className="flex-1 p-4 md:p-8 overflow-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
          <p className="text-gray-500 mt-1">Gerencie todos os seus clientes em um só lugar</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar por nome, email, CPF ou telefone..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <select
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Todas as categorias</option>
                <option value="pessoa física">Pessoa Física</option>
                <option value="pessoa jurídica">Pessoa Jurídica</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader className="animate-spin h-8 w-8 text-teal-500 mr-2" />
            <span>Carregando clientes...</span>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CPF/CNPJ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-teal-100 rounded-full flex items-center justify-center">
                            <span className="text-teal-600 font-medium">{client.nome.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{client.nome}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{client.email}</div>
                        <div className="text-sm text-gray-500">{client.telefone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            getClientCategory(client.cpf) === "pessoa física"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {getClientCategory(client.cpf) === "pessoa física" ? "Pessoa Física" : "Pessoa Jurídica"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.cpf}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => openDetailModal(client)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Ver detalhes"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => openEditModal(client)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => deleteClient(client.id)}
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
                      {searchTerm || selectedCategory !== "all"
                        ? "Nenhum cliente encontrado com os filtros atuais."
                        : "Nenhum cliente cadastrado."}
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
              Mostrando <span className="font-medium">{filteredClients.length}</span> de{" "}
              <span className="font-medium">{clients.length}</span> clientes
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

      {/* Modal de detalhes do cliente */}
      {isDetailModalOpen && selectedClient && (
        <ClientDetailModal
          client={selectedClient}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}
      {isEditModalOpen && selectedClient && (
        <ClientEditModal
          client={selectedClient}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onClientUpdated={handleClientUpdated}
        />
      )}
    </div>
  )
}

