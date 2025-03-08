"use client"

import type React from "react"

import { useState } from "react"

interface AddressSuggestion {
  description: string
  placeId: string
}

interface AddressSuggestionsProps {
  onSelectAddress: (address: string) => void
}

export default function AddressSuggestions({ onSelectAddress }: AddressSuggestionsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Sample suggestions for demonstration
  const sampleSuggestions: AddressSuggestion[] = [
    { description: "Avenida Paulista, São Paulo, SP", placeId: "1" },
    { description: "Avenida Atlântica, Copacabana, Rio de Janeiro, RJ", placeId: "2" },
    { description: "Parque Ibirapuera, São Paulo, SP", placeId: "3" },
    { description: "Pelourinho, Salvador, BA", placeId: "4" },
    { description: "Avenida Boa Viagem, Recife, PE", placeId: "5" },
    { description: "Esplanada dos Ministérios, Brasília, DF", placeId: "6" },
    { description: "Jardim Botânico, Curitiba, PR", placeId: "7" },
    { description: "Mineirão, Belo Horizonte, MG", placeId: "8" },
    { description: "Avenida Beira Mar, Fortaleza, CE", placeId: "9" },
    { description: "Teatro Amazonas, Manaus, AM", placeId: "10" },
  ]

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)

    if (value.length > 2) {
      setIsLoading(true)

      // Simulate API delay
      setTimeout(() => {
        const filtered = sampleSuggestions.filter((suggestion) =>
          suggestion.description.toLowerCase().includes(value.toLowerCase()),
        )
        setSuggestions(filtered)
        setIsLoading(false)
      }, 300)
    } else {
      setSuggestions([])
    }
  }

  const handleSelectSuggestion = (suggestion: AddressSuggestion) => {
    onSelectAddress(suggestion.description)
    setSearchTerm(suggestion.description)
    setSuggestions([])
  }

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Digite para buscar endereços..."
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
      />

      {isLoading && (
        <div className="absolute right-3 top-2">
          <div className="animate-spin h-4 w-4 border-2 border-teal-500 rounded-full border-t-transparent"></div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          <ul>
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.placeId}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {suggestion.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

