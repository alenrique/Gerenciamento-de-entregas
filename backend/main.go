package main

import (
	"log"
	"net/http"

	"meu-projeto/backend/controllers"
	"meu-projeto/backend/database"
	"meu-projeto/backend/repositories"
	"meu-projeto/backend/services"
)

func main() {
	// Inicializa o banco de dados
	database.InitDB()

	// Configura o repositório, serviço e controlador
	deliveryRepo := &repositories.DeliveryRepository{DB: database.DB}
	deliveryService := &services.DeliveryService{Repository: deliveryRepo}
	deliveryController := &controllers.DeliveryController{Service: deliveryService}

	// Configura as rotas
	http.HandleFunc("/deliveries", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			deliveryController.Create(w, r)
		case http.MethodGet:
			deliveryController.List(w, r)
		default:
			http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/deliveries/id/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			deliveryController.FindByID(w, r)
		} else {
			http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/deliveries/city", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			deliveryController.FindByCity(w, r)
		} else {
			http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/deliveries/", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPut:
			deliveryController.Update(w, r)
		case http.MethodDelete:
			deliveryController.Delete(w, r)
		default:
			http.Error(w, "Método não permitido", http.StatusMethodNotAllowed)
		}
	})

	// Inicia o servidor
	log.Println("Servidor rodando na porta 8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
