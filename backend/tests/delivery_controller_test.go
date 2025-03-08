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

// init é uma função especial que é executada antes de qualquer teste.
func init() {
	// Carrega as variáveis de ambiente do arquivo .env
	if err := godotenv.Load("../.env"); err != nil {
		log.Fatal("Erro ao carregar o arquivo .env") // Encerra o programa se o arquivo .env não for encontrado
	} else {
		log.Println("Arquivo .env carregado com sucesso!") // Loga uma mensagem de sucesso
	}
}

// TestCreateDeliveryValidation testa as validações ao criar uma entrega.
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
	// Converte o payload para JSON
	body, _ := json.Marshal(payload)

	// Cria uma requisição HTTP POST com o payload
	req, _ := http.NewRequest("POST", "/deliveries", bytes.NewBuffer(body))
	rr := httptest.NewRecorder() // Cria um ResponseRecorder para capturar a resposta

	// Chama o método Create do controller
	controller.Create(rr, req)

	// Verifica se o status da resposta é 400 (Bad Request)
	if rr.Code != http.StatusBadRequest {
		t.Errorf("Esperava status %d, mas recebeu %d", http.StatusBadRequest, rr.Code)
	}

	// Decodifica a resposta JSON para um mapa
	var response map[string]string
	json.NewDecoder(rr.Body).Decode(&response)

	// Verifica se a mensagem de erro é a esperada
	if response["error"] != expectedError {
		t.Errorf("Esperava erro '%s', mas recebeu '%s'", expectedError, response["error"])
	}
}

// TestFindByIDValidation testa as validações ao buscar uma entrega por ID.
func TestFindByIDValidation(t *testing.T) {
	// Configura o banco de dados e o repositório
	database.InitDB()
	repo := &repositories.DeliveryRepository{DB: database.DB}
	service := &services.DeliveryService{Repository: repo}
	controller := &controllers.DeliveryController{Service: service}

	// Caso de teste: ID inválido
	t.Run("ID inválido", func(t *testing.T) {
		// Cria uma requisição HTTP GET com um ID inválido
		req, _ := http.NewRequest("GET", "/deliveries/id/abc", nil) // ID inválido
		rr := httptest.NewRecorder()                                // Cria um ResponseRecorder para capturar a resposta

		// Chama o método FindByID do controller
		controller.FindByID(rr, req)

		// Verifica se o status da resposta é 400 (Bad Request)
		if rr.Code != http.StatusBadRequest {
			t.Errorf("Esperava status %d, mas recebeu %d", http.StatusBadRequest, rr.Code)
		}

		// Decodifica a resposta JSON para um mapa
		var response map[string]string
		json.NewDecoder(rr.Body).Decode(&response)

		// Verifica se a mensagem de erro é a esperada
		if response["error"] != "ID inválido" {
			t.Errorf("Esperava erro 'ID inválido', mas recebeu '%s'", response["error"])
		}
	})
}

// TestFindByCityValidation testa as validações ao buscar entregas por cidade.
func TestFindByCityValidation(t *testing.T) {
	// Configura o banco de dados e o repositório
	database.InitDB()
	repo := &repositories.DeliveryRepository{DB: database.DB}
	service := &services.DeliveryService{Repository: repo}
	controller := &controllers.DeliveryController{Service: service}

	// Caso de teste: Cidade não fornecida
	t.Run("Cidade não fornecida", func(t *testing.T) {
		// Cria uma requisição HTTP GET sem o parâmetro de cidade
		req, _ := http.NewRequest("GET", "/deliveries/city", nil) // Cidade não fornecida
		rr := httptest.NewRecorder()                              // Cria um ResponseRecorder para capturar a resposta

		// Chama o método FindByCity do controller
		controller.FindByCity(rr, req)

		// Verifica se o status da resposta é 400 (Bad Request)
		if rr.Code != http.StatusBadRequest {
			t.Errorf("Esperava status %d, mas recebeu %d", http.StatusBadRequest, rr.Code)
		}

		// Decodifica a resposta JSON para um mapa
		var response map[string]string
		json.NewDecoder(rr.Body).Decode(&response)

		// Verifica se a mensagem de erro é a esperada
		if response["error"] != "O parâmetro 'cidade' é obrigatório" {
			t.Errorf("Esperava erro 'O parâmetro 'cidade' é obrigatório', mas recebeu '%s'", response["error"])
		}
	})
}
