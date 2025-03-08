"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, BarChart, MapPin, Package, Loader } from "lucide-react"
import StatusPieChart from "./charts/status-pie-chart"
import CitiesBarChart from "./charts/cities-bar-chart"

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

// Interface para os dados do gráfico
interface ChartData {
  label: string
  value: number
}

export default function Dashboard() {
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [clientes, setClientes] = useState<ClienteAPI[]>([])

  const [cidadesData, setCidadesData] = useState<ChartData[]>([])
  const [estadosData, setEstadosData] = useState<ChartData[]>([])

  // Estatísticas
  const [estatisticas, setEstatisticas] = useState({
    totalEntregas: 0,
    pesoMedio: 0,
  })

  useEffect(() => {
    setIsClient(true)

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

        // Processar dados para os gráficos e estatísticas
        processarDados(entregasData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ocorreu um erro ao buscar os dados")
        console.error("Erro ao buscar dados:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Processar dados para os gráficos e estatísticas
  const processarDados = (entregas: EntregaAPI[]) => {
    // Calcular estatísticas gerais
    const totalEntregas = entregas.length
    const pesoTotal = entregas.reduce((acc, entrega) => acc + entrega.peso, 0)
    const pesoMedio = totalEntregas > 0 ? Number((pesoTotal / totalEntregas).toFixed(1)) : 0

    setEstatisticas({
      totalEntregas,
      pesoMedio,
    })

    // Processar dados para o gráfico de cidades
    const cidadesCount: Record<string, number> = {}
    entregas.forEach((entrega) => {
      const cidade = entrega.cidade
      cidadesCount[cidade] = (cidadesCount[cidade] || 0) + 1
    })

    const cidadesArray = Object.entries(cidadesCount)
      .map(([cidade, count]) => ({ label: cidade, value: count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8) // Pegar as 8 cidades com mais entregas

    setCidadesData(cidadesArray)

    // Processar dados para o gráfico de estados
    const estadosCount: Record<string, number> = {}
    entregas.forEach((entrega) => {
      const estado = entrega.estado
      estadosCount[estado] = (estadosCount[estado] || 0) + 1
    })

    const estadosArray = Object.entries(estadosCount)
      .map(([estado, count]) => ({ label: estado, value: count }))
      .sort((a, b) => b.value - a.value)

    setEstadosData(estadosArray)
  }

  // Cores para o gráfico de estados
  const estadosCores = [
    "#10b981", // verde
    "#3b82f6", // azul
    "#f59e0b", // âmbar
    "#8b5cf6", // roxo
    "#ec4899", // rosa
    "#ef4444", // vermelho
    "#06b6d4", // ciano
    "#6366f1", // índigo
    "#84cc16", // verde-limão
    "#14b8a6", // verde-azulado
  ]

  // Formatar dados para o gráfico de estados
  const estadosChartData = estadosData.map((item, index) => ({
    status: item.label,
    count: item.value,
    color: estadosCores[index % estadosCores.length],
  }))

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader className="animate-spin h-8 w-8 text-teal-500 mr-2" />
              <span>Carregando dados do dashboard...</span>
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
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Entregas</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{estatisticas.totalEntregas}</div>
                    <p className="text-xs text-muted-foreground">Entregas registradas no sistema</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
                    <User className="h-4 w-4 text-amber-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{clientes.length}</div>
                    <p className="text-xs text-muted-foreground">Clientes cadastrados</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cidades Atendidas</CardTitle>
                    <MapPin className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{cidadesData.length}</div>
                    <p className="text-xs text-muted-foreground">Locais com entregas</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Peso Médio</CardTitle>
                    <Package className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{estatisticas.pesoMedio} kg</div>
                    <p className="text-xs text-muted-foreground">Média por entrega</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Cidades com Mais Entregas</CardTitle>
                      <BarChart className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <CardDescription>Distribuição de entregas por cidade</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    {isClient && cidadesData.length > 0 ? (
                      <CitiesBarChart data={cidadesData.map((item) => ({ city: item.label, count: item.value }))} />
                    ) : (
                      <div className="flex justify-center items-center h-[300px] text-gray-400">
                        Sem dados suficientes para exibir o gráfico
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="col-span-3">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Estados com Mais Entregas</CardTitle>
                      <PieChart className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <CardDescription>Distribuição por estado</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center items-center">
                    {isClient && estadosChartData.length > 0 ? (
                      <StatusPieChart data={estadosChartData} />
                    ) : (
                      <div className="flex justify-center items-center h-[300px] text-gray-400">
                        Sem dados suficientes para exibir o gráfico
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Componente User para o ícone de usuário
function User(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

