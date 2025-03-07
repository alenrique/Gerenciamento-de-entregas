package utils

import (
	"strings"
)

// Valida o formato do CPF
func ValidateCPF(cpf string) bool {
	// Remove pontos e traços
	cpf = strings.ReplaceAll(cpf, ".", "")
	cpf = strings.ReplaceAll(cpf, "-", "")

	// Verifica se o CPF tem 11 dígitos
	if len(cpf) != 11 {
		return false
	}

	// Verifica se todos os dígitos são iguais (CPF inválido)
	if allDigitsEqual(cpf) {
		return false
	}

	// Validação dos dígitos verificadores
	if !validateCPFDigits(cpf) {
		return false
	}

	return true
}

// Verifica se todos os dígitos do CPF são iguais
func allDigitsEqual(cpf string) bool {
	firstDigit := cpf[0]
	for _, digit := range cpf {
		if string(digit) != string(firstDigit) {
			return false
		}
	}
	return true
}

// Valida os dígitos verificadores do CPF
func validateCPFDigits(cpf string) bool {
	// Cálculo do primeiro dígito verificador
	sum := 0
	for i := 0; i < 9; i++ {
		digit := int(cpf[i] - '0')
		sum += digit * (10 - i)
	}
	remainder := sum % 11
	firstDigit := 0
	if remainder >= 2 {
		firstDigit = 11 - remainder
	}

	// Cálculo do segundo dígito verificador
	sum = 0
	for i := 0; i < 10; i++ {
		digit := int(cpf[i] - '0')
		sum += digit * (11 - i)
	}
	remainder = sum % 11
	secondDigit := 0
	if remainder >= 2 {
		secondDigit = 11 - remainder
	}

	// Verifica se os dígitos calculados correspondem aos dígitos do CPF
	return int(cpf[9]-'0') == firstDigit && int(cpf[10]-'0') == secondDigit
}
