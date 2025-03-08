package utils

import (
	"strings"
)

// ValidateCPF valida o formato de um CPF.
func ValidateCPF(cpf string) bool {
	// Remove pontos e traços do CPF
	cpf = strings.ReplaceAll(cpf, ".", "")
	cpf = strings.ReplaceAll(cpf, "-", "")

	// Verifica se o CPF tem exatamente 11 dígitos
	if len(cpf) != 11 {
		return false
	}

	// Verifica se todos os dígitos do CPF são iguais (CPF inválido)
	if allDigitsEqual(cpf) {
		return false
	}

	// Valida os dígitos verificadores do CPF
	if !validateCPFDigits(cpf) {
		return false
	}

	// Se todas as verificações passarem, o CPF é válido
	return true
}

// allDigitsEqual verifica se todos os dígitos do CPF são iguais.
func allDigitsEqual(cpf string) bool {
	firstDigit := cpf[0] // Pega o primeiro dígito do CPF
	for _, digit := range cpf {
		if string(digit) != string(firstDigit) {
			return false // Se algum dígito for diferente, retorna false
		}
	}
	return true // Se todos os dígitos forem iguais, retorna true
}

// validateCPFDigits valida os dígitos verificadores do CPF.
func validateCPFDigits(cpf string) bool {
	// Cálculo do primeiro dígito verificador
	sum := 0
	for i := 0; i < 9; i++ {
		digit := int(cpf[i] - '0') // Converte o caractere para um número
		sum += digit * (10 - i)    // Multiplica o dígito pelo peso (10 - i)
	}
	remainder := sum % 11 // Calcula o resto da divisão por 11
	firstDigit := 0
	if remainder >= 2 {
		firstDigit = 11 - remainder // Calcula o primeiro dígito verificador
	}

	// Cálculo do segundo dígito verificador
	sum = 0
	for i := 0; i < 10; i++ {
		digit := int(cpf[i] - '0') // Converte o caractere para um número
		sum += digit * (11 - i)    // Multiplica o dígito pelo peso (11 - i)
	}
	remainder = sum % 11 // Calcula o resto da divisão por 11
	secondDigit := 0
	if remainder >= 2 {
		secondDigit = 11 - remainder // Calcula o segundo dígito verificador
	}

	// Verifica se os dígitos verificadores calculados correspondem aos dígitos do CPF
	return int(cpf[9]-'0') == firstDigit && int(cpf[10]-'0') == secondDigit
}
