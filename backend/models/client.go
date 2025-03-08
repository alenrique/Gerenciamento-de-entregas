package models

type Cliente struct {
	ID       int    `json:"id"`
	Nome     string `json:"nome"`
	CPF      string `json:"cpf"`
	Email    string `json:"email"`
	Telefone string `json:"telefone"`
}
