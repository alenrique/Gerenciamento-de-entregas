"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Loader } from "lucide-react"

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

export default function Statistics() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [entregas, setEntregas] = useState<EntregaAPI[]>([])
  const [clientes, setClientes] = useState<ClienteAPI[]>([])

  const [cidadesData, setCidadesData] = useState<ChartData[]>([])
  const [estadosData, setEstadosData] = useState<ChartData[]>([])

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
        setEntregas(entregasData)

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

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div>
          <h1 className="text-2xl font-bold text-gray-800">Estatísticas</h1>
          <p className="text-gray-500 mt-1">Todas as estatísticas aqui</p>
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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Entregas Recentes</CardTitle>
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <CardDescription>Últimas entregas registradas no sistema</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {entregas.slice(0, 5).map((entrega) => {
                        return (
                          <div key={entrega.id} className="flex items-center">
                            <div className="mr-2 h-2 w-2 rounded-full bg-blue-500" />
                            <div className="flex-1 flex justify-between">
                              <div className="font-medium">Entrega #{entrega.id}</div>
                              <div className="text-sm text-muted-foreground">
                                {entrega.cidade}, {entrega.estado}
                              </div>
                            </div>
                          </div>
                        )
                      })}

                      {entregas.length === 0 && (
                        <div className="text-center text-gray-500 py-4">Nenhuma entrega registrada</div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Estatísticas Gerais</CardTitle>
                    <CardDescription>Resumo das operações de entrega</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Média de Entregas por Cliente</div>
                        <div className="font-bold text-green-500">
                          {clientes.length > 0 ? (entregas.length / clientes.length).toFixed(1) : "0"}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Peso Total Transportado</div>
                        <div className="font-bold">
                          {entregas.reduce((acc, entrega) => acc + entrega.peso, 0).toFixed(1)} kg
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Estados Atendidos</div>
                        <div className="font-bold">{estadosData.length}</div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Cidade com Mais Entregas</div>
                        <div className="font-bold">{cidadesData.length > 0 ? cidadesData[0].label : "N/A"}</div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Estado com Mais Entregas</div>
                        <div className="font-bold">{estadosData.length > 0 ? estadosData[0].label : "N/A"}</div>
                      </div>
                    </div>
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

