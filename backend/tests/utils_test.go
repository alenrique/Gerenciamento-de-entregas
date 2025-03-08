package tests

import (
	"meu-projeto/backend/utils"
	"testing"
)

// TestValidateCPF testa a função ValidateCPF do pacote utils.
func TestValidateCPF(t *testing.T) {
	// Define uma lista de casos de teste
	tests := []struct {
		cpf      string // CPF a ser testado
		expected bool   // Resultado esperado (true para válido, false para inválido)
	}{
		{"123.456.789-09", true},  // CPF válido
		{"111.111.111-11", false}, // CPF inválido (todos os dígitos iguais)
		{"123", false},            // CPF inválido (tamanho incorreto)
		{"", false},               // CPF inválido (vazio)
	}

	// Itera sobre os casos de teste
	for _, test := range tests {
		// Chama a função ValidateCPF com o CPF do caso de teste
		result := utils.ValidateCPF(test.cpf)

		// Verifica se o resultado obtido é igual ao resultado esperado
		if result != test.expected {
			// Se não for, exibe uma mensagem de erro
			t.Errorf("ValidateCPF(%s) = %v; esperava %v", test.cpf, result, test.expected)
		}
	}
}
