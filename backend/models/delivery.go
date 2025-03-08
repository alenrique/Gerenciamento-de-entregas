package models

// Delivery é uma estrutura que representa uma entrega no sistema.
type Delivery struct {
	ID          int     `json:"id"`          // ID único da entrega
	ClienteID   int     `json:"cliente_id"`  // ID do cliente associado à entrega
	Peso        float64 `json:"peso"`        // Peso da entrega (em kg)
	Endereco    string  `json:"endereco"`    // Endereço completo da entrega
	Logradouro  string  `json:"logradouro"`  // Nome da rua, avenida, etc.
	Numero      string  `json:"numero"`      // Número do endereço
	Bairro      string  `json:"bairro"`      // Bairro do endereço
	Complemento string  `json:"complemento"` // Complemento do endereço (ex: apartamento, bloco)
	Cidade      string  `json:"cidade"`      // Cidade do endereço
	Estado      string  `json:"estado"`      // Estado (UF) do endereço
	Pais        string  `json:"pais"`        // País do endereço
	Latitude    float64 `json:"latitude"`    // Latitude da localização da entrega
	Longitude   float64 `json:"longitude"`   // Longitude da localização da entrega
}
