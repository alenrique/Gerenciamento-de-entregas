package tests

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/joho/godotenv"

	"meu-projeto/backend/controllers"
	"meu-projeto/backend/database"
	"meu-projeto/backend/repositories"
	"meu-projeto/backend/services"
)

func init() {
	// Carrega as variáveis de ambiente do arquivo .env
	if err := godotenv.Load("../.env"); err != nil {
		log.Fatal("Erro ao carregar o arquivo .env")
	} else {
		log.Println("Arquivo .env carregado com sucesso!")
	}
}

func TestCreateDeliveryValidation(t *testing.T) {

	// Configura o banco de dados e o repositório
	database.InitDB()
	repo := &repositories.DeliveryRepository{DB: database.DB}
	service := &services.DeliveryService{Repository: repo}
	controller := &controllers.DeliveryController{Service: service}

	// Caso de teste 1: Campo 'peso' ausente
	t.Run("Campo 'peso' ausente", func(t *testing.T) {
		payload := map[string]interface{}{
			"delivery": map[string]interface{}{
				"endereco": "Rua das Flores, 123",
				"cidade":   "São Paulo",
			},
			"cliente": map[string]interface{}{
				"nome": "João Silva",
				"cpf":  "529.982.247-25",
			},
		}
		testValidation(t, controller, payload, "O campo 'peso' é obrigatório e deve ser maior que zero")
	})

	// Caso de teste 2: CPF inválido
	t.Run("CPF inválido", func(t *testing.T) {
		payload := map[string]interface{}{
			"delivery": map[string]interface{}{
				"peso":     5.5,
				"endereco": "Rua das Flores, 123",
				"cidade":   "São Paulo",
			},
			"cliente": map[string]interface{}{
				"nome": "João Silva",
				"cpf":  "123.456.789-00", // CPF inválido
			},
		}
		testValidation(t, controller, payload, "CPF inválido")
	})
}

// Função auxiliar para testar validações
func testValidation(t *testing.T, controller *controllers.DeliveryController, payload map[string]interface{}, expectedError string) {
	body, _ := json.Marshal(payload)
	req, _ := http.NewRequest("POST", "/deliveries", bytes.NewBuffer(body))
	rr := httptest.NewRecorder()

	controller.Create(rr, req)

	if rr.Code != http.StatusBadRequest {
		t.Errorf("Esperava status %d, mas recebeu %d", http.StatusBadRequest, rr.Code)
	}

	var response map[string]string
	json.NewDecoder(rr.Body).Decode(&response)

	if response["error"] != expectedError {
		t.Errorf("Esperava erro '%s', mas recebeu '%s'", expectedError, response["error"])
	}
}

func TestFindByIDValidation(t *testing.T) {
	// Configura o banco de dados e o repositório
	database.InitDB()
	repo := &repositories.DeliveryRepository{DB: database.DB}
	service := &services.DeliveryService{Repository: repo}
	controller := &controllers.DeliveryController{Service: service}

	// Caso de teste: ID inválido
	t.Run("ID inválido", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/deliveries/id/abc", nil) // ID inválido
		rr := httptest.NewRecorder()

		controller.FindByID(rr, req)

		if rr.Code != http.StatusBadRequest {
			t.Errorf("Esperava status %d, mas recebeu %d", http.StatusBadRequest, rr.Code)
		}

		var response map[string]string
		json.NewDecoder(rr.Body).Decode(&response)

		if response["error"] != "ID inválido" {
			t.Errorf("Esperava erro 'ID inválido', mas recebeu '%s'", response["error"])
		}
	})
}

func TestFindByCityValidation(t *testing.T) {
	// Configura o banco de dados e o repositório
	database.InitDB()
	repo := &repositories.DeliveryRepository{DB: database.DB}
	service := &services.DeliveryService{Repository: repo}
	controller := &controllers.DeliveryController{Service: service}

	// Caso de teste: Cidade não fornecida
	t.Run("Cidade não fornecida", func(t *testing.T) {
		req, _ := http.NewRequest("GET", "/deliveries/city", nil) // Cidade não fornecida
		rr := httptest.NewRecorder()

		controller.FindByCity(rr, req)

		if rr.Code != http.StatusBadRequest {
			t.Errorf("Esperava status %d, mas recebeu %d", http.StatusBadRequest, rr.Code)
		}

		var response map[string]string
		json.NewDecoder(rr.Body).Decode(&response)

		if response["error"] != "O parâmetro 'cidade' é obrigatório" {
			t.Errorf("Esperava erro 'O parâmetro 'cidade' é obrigatório', mas recebeu '%s'", response["error"])
		}
	})
}
