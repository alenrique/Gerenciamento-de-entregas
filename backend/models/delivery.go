package models

type Delivery struct {
	ID          int     `json:"id"`
	ClienteID   int     `json:"cliente_id"`
	Peso        float64 `json:"peso"`
	Endereco    string  `json:"endereco"`
	Logradouro  string  `json:"logradouro"`
	Numero      string  `json:"numero"`
	Bairro      string  `json:"bairro"`
	Complemento string  `json:"complemento"`
	Cidade      string  `json:"cidade"`
	Estado      string  `json:"estado"`
	Pais        string  `json:"pais"`
	Latitude    float64 `json:"latitude"`
	Longitude   float64 `json:"longitude"`
}

type Cliente struct {
	ID       int    `json:"id"`
	Nome     string `json:"nome"`
	CPF      string `json:"cpf"`
	Email    string `json:"email"`
	Telefone string `json:"telefone"`
}
