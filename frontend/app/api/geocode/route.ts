import { NextResponse } from "next/server"

// Enhanced mock implementation with more Brazilian locations
export async function POST(request: Request) {
  try {
    const { address } = await request.json()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Default result structure
    let result = {
      logradouro: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
      pais: "Brasil",
      latitude: "",
      longitude: "",
    }

    // Normalized address for easier matching
    const normalizedAddress = address.toLowerCase().trim()

    // Collection of mock locations
    const locations = [
      {
        keywords: ["paulista", "são paulo", "sp", "bela vista"],
        data: {
          logradouro: "Avenida Paulista",
          numero: "1000",
          bairro: "Bela Vista",
          cidade: "São Paulo",
          estado: "SP",
          pais: "Brasil",
          latitude: "-23.5632",
          longitude: "-46.6542",
        },
      },
      {
        keywords: ["copacabana", "rio", "rio de janeiro", "rj"],
        data: {
          logradouro: "Avenida Atlântica",
          numero: "500",
          bairro: "Copacabana",
          cidade: "Rio de Janeiro",
          estado: "RJ",
          pais: "Brasil",
          latitude: "-22.9671",
          longitude: "-43.1869",
        },
      },
      {
        keywords: ["ibirapuera", "parque"],
        data: {
          logradouro: "Avenida Pedro Álvares Cabral",
          numero: "s/n",
          bairro: "Vila Mariana",
          cidade: "São Paulo",
          estado: "SP",
          pais: "Brasil",
          latitude: "-23.5874",
          longitude: "-46.6576",
        },
      },
      {
        keywords: ["salvador", "bahia", "ba", "pelourinho"],
        data: {
          logradouro: "Largo do Pelourinho",
          numero: "10",
          bairro: "Pelourinho",
          cidade: "Salvador",
          estado: "BA",
          pais: "Brasil",
          latitude: "-12.9739",
          longitude: "-38.5108",
        },
      },
      {
        keywords: ["recife", "pernambuco", "pe", "boa viagem"],
        data: {
          logradouro: "Avenida Boa Viagem",
          numero: "1000",
          bairro: "Boa Viagem",
          cidade: "Recife",
          estado: "PE",
          pais: "Brasil",
          latitude: "-8.1208",
          longitude: "-34.8992",
        },
      },
      {
        keywords: ["brasília", "brasilia", "df", "distrito federal", "esplanada"],
        data: {
          logradouro: "Esplanada dos Ministérios",
          numero: "s/n",
          bairro: "Zona Cívico-Administrativa",
          cidade: "Brasília",
          estado: "DF",
          pais: "Brasil",
          latitude: "-15.7989",
          longitude: "-47.8649",
        },
      },
      {
        keywords: ["curitiba", "paraná", "parana", "pr", "jardim botânico"],
        data: {
          logradouro: "Rua Engenheiro Ostoja Roguski",
          numero: "350",
          bairro: "Jardim Botânico",
          cidade: "Curitiba",
          estado: "PR",
          pais: "Brasil",
          latitude: "-25.4412",
          longitude: "-49.2362",
        },
      },
      {
        keywords: ["belo horizonte", "minas", "mg", "mineirão", "mineirao"],
        data: {
          logradouro: "Avenida Antônio Abrahão Caram",
          numero: "1001",
          bairro: "Pampulha",
          cidade: "Belo Horizonte",
          estado: "MG",
          pais: "Brasil",
          latitude: "-19.8657",
          longitude: "-43.9711",
        },
      },
      {
        keywords: ["fortaleza", "ceará", "ceara", "ce", "beira mar"],
        data: {
          logradouro: "Avenida Beira Mar",
          numero: "500",
          bairro: "Meireles",
          cidade: "Fortaleza",
          estado: "CE",
          pais: "Brasil",
          latitude: "-3.7319",
          longitude: "-38.5089",
        },
      },
      {
        keywords: ["manaus", "amazonas", "am", "teatro amazonas"],
        data: {
          logradouro: "Avenida Eduardo Ribeiro",
          numero: "659",
          bairro: "Centro",
          cidade: "Manaus",
          estado: "AM",
          pais: "Brasil",
          latitude: "-3.1303",
          longitude: "-60.0231",
        },
      },
    ]

    // Find matching location
    for (const location of locations) {
      if (location.keywords.some((keyword) => normalizedAddress.includes(keyword))) {
        result = location.data
        break
      }
    }

    // If no specific match found, use a default location
    if (!result.logradouro) {
      result = {
        logradouro: "Rua Principal",
        numero: "123",
        bairro: "Centro",
        cidade: "Cidade Exemplo",
        estado: "UF",
        pais: "Brasil",
        latitude: "-15.7801",
        longitude: "-47.9292",
      }
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Error in geocoding API:", error)
    return NextResponse.json({ success: false, error: "Failed to geocode address" }, { status: 500 })
  }
}

