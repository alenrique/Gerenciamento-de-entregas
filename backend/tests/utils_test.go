package tests

import (
	"meu-projeto/backend/utils"
	"testing"
)

func TestValidateCPF(t *testing.T) {
	tests := []struct {
		cpf      string
		expected bool
	}{
		{"123.456.789-09", true},  // CPF válido
		{"111.111.111-11", false}, // CPF inválido (todos os dígitos iguais)
		{"123", false},            // CPF inválido (tamanho incorreto)
		{"", false},               // CPF inválido (vazio)
	}

	for _, test := range tests {
		result := utils.ValidateCPF(test.cpf)
		if result != test.expected {
			t.Errorf("ValidateCPF(%s) = %v; esperava %v", test.cpf, result, test.expected)
		}
	}
}
