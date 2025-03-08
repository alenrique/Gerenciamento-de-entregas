package main

import (
	"log"
	"net/http"

	"meu-projeto/backend/controllers"
	"meu-projeto/backend/database"
	"meu-projeto/backend/repositories"
	"meu-projeto/backend/services"
)

// Middleware para habilitar CORS
func enableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

func main() {
	// Inicializa o banco de dados
	database.InitDB()

	// Configura o repositório, serviço e controlador para entregas
	deliveryRepo := &repositories.DeliveryRepository{DB: database.DB}
	deliveryService := &services.DeliveryService{Repository: deliveryRepo}
	deliveryController := &controllers.DeliveryController{Service: deliveryService}

	// Configura o repositório, serviço e controlador para clientes
	clientRepo := &repositories.ClientRepository{DB: database.DB}
	clientService := &services.ClientService{Repository: clientRepo}
	clientController := &controllers.ClientController{Service: clientService}

	// Configura as rotas para entregas
	http.HandleFunc("/deliveries", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			deliveryController.Create(w, r)
		case http.MethodGet:
			deliveryController.List(w, r)
		default:
			http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		}
	}))

	http.HandleFunc("/deliveries/id/", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			deliveryController.FindByID(w, r)
		} else {
			http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		}
	}))

	http.HandleFunc("/deliveries/city", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			deliveryController.FindByCity(w, r)
		} else {
			http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		}
	}))

	http.HandleFunc("/deliveries/", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPut:
			deliveryController.Update(w, r)
		case http.MethodDelete:
			deliveryController.Delete(w, r)
		default:
			http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		}
	}))

	// Configura as rotas para clientes
	http.HandleFunc("/clients", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			clientController.Create(w, r)
		case http.MethodGet:
			clientController.List(w, r)
		default:
			http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		}
	}))

	http.HandleFunc("/clients/id/", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			clientController.FindByID(w, r)
		} else {
			http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		}
	}))

	http.HandleFunc("/clients/", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPut:
			clientController.Update(w, r)
		case http.MethodDelete:
			clientController.Delete(w, r)
		default:
			http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		}
	}))

	// Inicia o servidor
	log.Println("Servidor rodando na porta 8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
