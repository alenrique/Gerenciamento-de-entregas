package models

// Cliente é uma estrutura que representa um cliente no sistema.
type Cliente struct {
	ID       int    `json:"id"`       // ID único do cliente
	Nome     string `json:"nome"`     // Nome completo do cliente
	CPF      string `json:"cpf"`      // CPF do cliente (formato: 123.456.789-00)
	Email    string `json:"email"`    // Endereço de e-mail do cliente
	Telefone string `json:"telefone"` // Número de telefone do cliente
}
