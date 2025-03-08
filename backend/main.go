package main

import (
	"log"
	"net/http"

	"meu-projeto/backend/controllers"
	"meu-projeto/backend/database"
	"meu-projeto/backend/repositories"
	"meu-projeto/backend/services"
)

// Middleware para habilitar CORS (Cross-Origin Resource Sharing)
func enableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Permite que qualquer origem (*) acesse a API
		w.Header().Set("Access-Control-Allow-Origin", "*")
		// Define os métodos HTTP permitidos
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		// Define os cabeçalhos permitidos
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Se o método da requisição for OPTIONS, responde com OK e não passa para o próximo handler
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Chama o próximo handler na cadeia
		next(w, r)
	}
}

func main() {
	// Inicializa a conexão com o banco de dados
	database.InitDB()

	// Configura o repositório, serviço e controlador para a entidade "Delivery" (Entregas)
	deliveryRepo := &repositories.DeliveryRepository{DB: database.DB}               // Repositório para acessar o banco de dados
	deliveryService := &services.DeliveryService{Repository: deliveryRepo}          // Serviço para aplicar regras de negócio
	deliveryController := &controllers.DeliveryController{Service: deliveryService} // Controlador para lidar com requisições HTTP

	// Configura o repositório, serviço e controlador para a entidade "Client" (Clientes)
	clientRepo := &repositories.ClientRepository{DB: database.DB}             // Repositório para acessar o banco de dados
	clientService := &services.ClientService{Repository: clientRepo}          // Serviço para aplicar regras de negócio
	clientController := &controllers.ClientController{Service: clientService} // Controlador para lidar com requisições HTTP

	// Configura as rotas para a entidade "Delivery" (Entregas)

	// Rota para criar uma entrega (POST) ou listar todas as entregas (GET)
	http.HandleFunc("/deliveries", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			deliveryController.Create(w, r) // Cria uma nova entrega
		case http.MethodGet:
			deliveryController.List(w, r) // Lista todas as entregas
		default:
			http.Error(w, "Método não permitido", http.StatusMethodNotAllowed) // Retorna erro para métodos não permitidos
		}
	}))

	// Rota para buscar uma entrega pelo ID (GET)
	http.HandleFunc("/deliveries/id/", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			deliveryController.FindByID(w, r) // Busca uma entrega pelo ID
		} else {
			http.Error(w, "Método não permitido", http.StatusMethodNotAllowed) // Retorna erro para métodos não permitidos
		}
	}))

	// Rota para buscar entregas por cidade (GET)
	http.HandleFunc("/deliveries/city", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			deliveryController.FindByCity(w, r) // Busca entregas por cidade
		} else {
			http.Error(w, "Método não permitido", http.StatusMethodNotAllowed) // Retorna erro para métodos não permitidos
		}
	}))

	// Rota para atualizar (PUT) ou deletar (DELETE) uma entrega
	http.HandleFunc("/deliveries/", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPut:
			deliveryController.Update(w, r) // Atualiza uma entrega existente
		case http.MethodDelete:
			deliveryController.Delete(w, r) // Deleta uma entrega existente
		default:
			http.Error(w, "Método não permitido", http.StatusMethodNotAllowed) // Retorna erro para métodos não permitidos
		}
	}))

	// Configura as rotas para a entidade "Client" (Clientes)

	// Rota para criar um cliente (POST) ou listar todos os clientes (GET)
	http.HandleFunc("/clients", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			clientController.Create(w, r) // Cria um novo cliente
		case http.MethodGet:
			clientController.List(w, r) // Lista todos os clientes
		default:
			http.Error(w, "Método não permitido", http.StatusMethodNotAllowed) // Retorna erro para métodos não permitidos
		}
	}))

	// Rota para buscar um cliente pelo ID (GET)
	http.HandleFunc("/clients/id/", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			clientController.FindByID(w, r) // Busca um cliente pelo ID
		} else {
			http.Error(w, "Método não permitido", http.StatusMethodNotAllowed) // Retorna erro para métodos não permitidos
		}
	}))

	// Rota para atualizar (PUT) ou deletar (DELETE) um cliente
	http.HandleFunc("/clients/", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPut:
			clientController.Update(w, r) // Atualiza um cliente existente
		case http.MethodDelete:
			clientController.Delete(w, r) // Deleta um cliente existente
		default:
			http.Error(w, "Método não permitido", http.StatusMethodNotAllowed) // Retorna erro para métodos não permitidos
		}
	}))

	// Inicia o servidor HTTP na porta 8080
	log.Println("Servidor rodando na porta 8080...")
	log.Fatal(http.ListenAndServe(":8080", nil)) // Inicia o servidor e loga erros, se houver
}
