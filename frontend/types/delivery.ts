// Tipo para o cliente
export interface Cliente {
    nome: string;
    email: string;
    telefone: string;
    cpf: string;
  }
  
  // Tipo para a entrega
  export interface Entrega {
    id: number;
    cliente_id: number;
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
  
  // Tipo para a requisição POST
  export interface PostDeliveryRequest {
    delivery: {
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
    };
    cliente: Cliente;
  }