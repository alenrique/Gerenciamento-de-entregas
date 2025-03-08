"use client"

import type React from "react"

import { useState } from "react"
import { Search, MapPin } from "lucide-react"
import AddressSuggestions from "./address-suggestions"
import MapPreview from "./map-preview"

interface DeliveryData {
  peso: number;
  endereco: string;
  logradouro: string;
  numero: string;
  bairro: string;
  complemento: string;
  cidade: string;
  estado: string;
  pais: string;
  latitude: number;
  longitude: number;
}

interface ClientData {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
}

export default function DeliveryRegistrationForm() {
  const [activeTab, setActiveTab] = useState("entrega")
  const [deliveryData, setDeliveryData] = useState<DeliveryData>({
    peso: 0,
    endereco: "",
    logradouro: "",
    numero: "",
    bairro: "",
    complemento: "",
    cidade: "",
    estado: "",
    pais: "",
    latitude: 0,
    longitude: 0,
  })

  const [clientData, setClientData] = useState<ClientData>({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [addressFound, setAddressFound] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDeliveryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Verifica se o campo é numérico
    const isNumericField = name === "peso" || name === "latitude" || name === "longitude";

    // Converte para número se for um campo numérico e o valor não for vazio
    const parsedValue = isNumericField && value !== "" ? parseFloat(value) : value;

    // Atualiza o estado
    setDeliveryData((prev) => ({
        ...prev,
        [name]: parsedValue,
    }));
};

const formatCPF = (value: string) => {
  let cpf = value.replace(/\D/g, ''); // Remove não dígitos
  if (cpf.length > 3) cpf = cpf.replace(/^(\d{3})/, '$1.');
  if (cpf.length > 7) cpf = cpf.replace(/^(\d{3})\.(\d{3})/, '$1.$2.');
  if (cpf.length > 11) cpf = cpf.replace(/^(\d{3})\.(\d{3})\.(\d{3})/, '$1.$2.$3-');
  return cpf.slice(0, 14); // Limita ao tamanho máximo do CPF com máscara
};

const formatTelefone = (value: string): string => {
  // Remove tudo que não é dígito
  let telefone = value.replace(/\D/g, '');

  // Verifica se o número tem o comprimento mínimo necessário
  if (telefone.length < 11) {
    return telefone; // Retorna o número sem formatação se for muito curto
  }

  // Aplica a máscara: (00) 00000-0000
  telefone = telefone.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');

  // Limita o tamanho do telefone a 15 caracteres (com máscara)
  return telefone.slice(0, 15);
};

const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  // Aplica a formatação de CPF
  if (name === "cpf") {
    const cpfFormatado = formatCPF(value);
    setClientData((prev) => ({ ...prev, [name]: cpfFormatado }));
    return;
  }

  // Aplica a formatação de telefone
  if (name === "telefone") {
    const telefoneFormatado = formatTelefone(value);
    setClientData((prev) => ({ ...prev, [name]: telefoneFormatado }));
    return;
  }

  // Para outros campos, atualiza normalmente
  setClientData((prev) => ({ ...prev, [name]: value }));
};

  const searchAddress = async () => {
    if (!deliveryData.endereco) return;

    setIsLoading(true);
    setAddressFound(false);

    try {
        // Substitua pela sua API de geocodificação
        const response = await fetch("/api/geocode", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ address: deliveryData.endereco }),
        });

        const result = await response.json();

        if (result.success) {
            setDeliveryData((prev) => ({
                ...prev,
                logradouro: result.data.logradouro,
                numero: result.data.numero,
                bairro: result.data.bairro,
                cidade: result.data.cidade,
                estado: result.data.estado,
                pais: result.data.pais,
                latitude: parseFloat(result.data.latitude), // Converte para número
                longitude: parseFloat(result.data.longitude), // Converte para número
            }));

            setAddressFound(true);
        } else {
            console.error("Erro ao buscar endereço:", result.error);
        }
    } catch (error) {
        console.error("Erro ao buscar endereço:", error);
    } finally {
        setIsLoading(false);
    }
};

  const handleSelectAddress = (address: string) => {
    setDeliveryData((prev) => ({ ...prev, endereco: address }))
    setShowSuggestions(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Combina os dados de entrega e cliente
    const formData = {
        delivery: deliveryData,
        cliente: clientData,
    };

    setIsSubmitting(true);

    try {
        // Substitua pela sua API de criação de entregas
        console.log(JSON.stringify(formData))
        const response = await fetch("http://localhost:8080/deliveries", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        
        console.log(result)
        if (result.success) {
            alert(result.message);

            // Reseta o formulário após o envio bem-sucedido
            setDeliveryData({
                peso: 0,
                endereco: "",
                logradouro: "",
                numero: "",
                bairro: "",
                complemento: "",
                cidade: "",
                estado: "",
                pais: "",
                latitude: 0,
                longitude: 0,
            });
            setClientData({
                nome: "",
                email: "",
                telefone: "",
                cpf: "",
            });
            setAddressFound(false);
        } else {
            alert(`Erro: ${result.error}`);
        }
    } catch (error) {
        console.error("Erro ao enviar formulário:", error);
        alert("Ocorreu um erro ao enviar o formulário");
    } finally {
        setIsSubmitting(false);
    }
};

  return (
    <div className="bg-white rounded-md shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">CADASTRO DE ENTREGAS</h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-2 text-sm font-medium flex items-center ${
            activeTab === "entrega" ? "text-teal-500 border-b-2 border-teal-500" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("entrega")}
        >
          <MapPin size={16} className="mr-1" />
          Dados da Entrega
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium flex items-center ${
            activeTab === "cliente" ? "text-teal-500 border-b-2 border-teal-500" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("cliente")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
          </svg>
          Dados do Cliente
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Form Content */}
        <div className="p-4">
          {activeTab === "entrega" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)*</label>
                  <input
                    type="number"
                    name="peso"
                    value={deliveryData.peso}
                    onChange={handleDeliveryChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="Ex: 5.2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo*</label>
                  <div className="flex flex-col space-y-2">
                    {showSuggestions ? (
                      <>
                        <AddressSuggestions onSelectAddress={handleSelectAddress} />
                        <button
                          type="button"
                          onClick={() => setShowSuggestions(false)}
                          className="text-xs text-teal-600 hover:text-teal-800"
                        >
                          Voltar para entrada manual
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex">
                          <input
                            type="text"
                            name="endereco"
                            value={deliveryData.endereco}
                            onChange={handleDeliveryChange}
                            className="w-full border border-gray-300 rounded-l-md px-3 py-2 text-sm"
                            placeholder="Digite o endereço completo"
                            required
                          />
                          <button
                            type="button"
                            onClick={searchAddress}
                            disabled={isLoading}
                            className="bg-teal-500 text-white px-3 py-2 rounded-r-md flex items-center"
                          >
                            {isLoading ? (
                              "Buscando..."
                            ) : (
                              <>
                                <Search size={16} className="mr-1" />
                                Buscar
                              </>
                            )}
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowSuggestions(true)}
                          className="text-xs text-teal-600 hover:text-teal-800"
                        >
                          Buscar endereços sugeridos
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logradouro</label>
                  <input
                    type="text"
                    name="logradouro"
                    value={deliveryData.logradouro}
                    onChange={handleDeliveryChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50"
                    readOnly={addressFound}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                  <input
                    type="text"
                    name="numero"
                    value={deliveryData.numero}
                    onChange={handleDeliveryChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50"
                    readOnly={addressFound}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                  <input
                    type="text"
                    name="bairro"
                    value={deliveryData.bairro}
                    onChange={handleDeliveryChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50"
                    readOnly={addressFound}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                  <input
                    type="text"
                    name="complemento"
                    value={deliveryData.complemento}
                    onChange={handleDeliveryChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                  <input
                    type="text"
                    name="cidade"
                    value={deliveryData.cidade}
                    onChange={handleDeliveryChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50"
                    readOnly={addressFound}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <input
                    type="text"
                    name="estado"
                    value={deliveryData.estado}
                    onChange={handleDeliveryChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50"
                    readOnly={addressFound}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                  <input
                    type="text"
                    name="pais"
                    value={deliveryData.pais}
                    onChange={handleDeliveryChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50"
                    readOnly={addressFound}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    name="latitude"
                    value={deliveryData.latitude}
                    onChange={handleDeliveryChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    name="longitude"
                    value={deliveryData.longitude}
                    onChange={handleDeliveryChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-100"
                  />
                </div>
              </div>

              {addressFound && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visualização do Mapa</label>
                  <MapPreview
                    latitude={deliveryData.latitude}
                    longitude={deliveryData.longitude}
                    address={`${deliveryData.logradouro}, ${deliveryData.numero} - ${deliveryData.cidade}, ${deliveryData.estado}`}
                  />
                </div>
              )}
              {addressFound && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-700">
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2" />
                    <span>Endereço localizado com sucesso! Os campos foram preenchidos automaticamente.</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "cliente" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo*</label>
                  <input
                    type="text"
                    name="nome"
                    value={clientData.nome}
                    onChange={handleClientChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                  <input
                    type="text"
                    name="cpf"
                    value={clientData.cpf}
                    onChange={handleClientChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                  <input
                    type="email"
                    name="email"
                    value={clientData.email}
                    onChange={handleClientChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone*</label>
                  <input
                    type="tel"
                    name="telefone"
                    value={clientData.telefone}
                    onChange={handleClientChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="p-4 border-t border-gray-200 flex justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-teal-500 text-white px-4 py-2 rounded-md text-sm flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                SALVANDO...
              </>
            ) : (
              "SALVAR ENTREGA"
            )}
          </button>
          <button
            type="button"
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm"
            onClick={() => {
              setDeliveryData({
                peso: 0,
                endereco: "",
                logradouro: "",
                numero: "",
                bairro: "",
                complemento: "",
                cidade: "",
                estado: "",
                pais: "",
                latitude: 0,
                longitude: 0,
              })
              setClientData({
                nome: "",
                email: "",
                telefone: "",
                cpf: "",
              })
              setAddressFound(false)
            }}
          >
            LIMPAR FORMULÁRIO
          </button>
        </div>
      </form>
    </div>
  )
}

