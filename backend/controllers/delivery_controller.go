package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"meu-projeto/backend/models"
	"meu-projeto/backend/services"
	"meu-projeto/backend/utils"
)

type DeliveryController struct {
	Service *services.DeliveryService
}

func (c *DeliveryController) Create(w http.ResponseWriter, r *http.Request) {
	var request struct {
		Delivery models.Delivery `json:"delivery"`
		Cliente  models.Cliente  `json:"cliente"`
	}

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Erro ao decodificar o JSON"})
		return
	}

	// Validação do formato do CPF
	if !utils.ValidateCPF(request.Cliente.CPF) {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "CPF inválido"})
		return
	}

	// Validação dos campos obrigatórios da entrega
	if request.Delivery.Peso <= 0 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "O campo 'peso' é obrigatório e deve ser maior que zero"})
		return
	}
	if request.Delivery.Endereco == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "O campo 'endereco' é obrigatório"})
		return
	}
	if request.Delivery.Cidade == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "O campo 'cidade' é obrigatório"})
		return
	}

	// Validação dos campos obrigatórios do cliente
	if request.Cliente.Nome == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "O campo 'nome' do cliente é obrigatório"})
		return
	}
	if request.Cliente.CPF == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "O campo 'cpf' do cliente é obrigatório"})
		return
	}

	id, err := c.Service.Create(request.Delivery, request.Cliente)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{"id": id, "message": "Entrega cadastrada com sucesso!"})
}

func (c *DeliveryController) List(w http.ResponseWriter, r *http.Request) {
	deliveries, err := c.Service.List()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(deliveries)
}

// Busca uma entrega por ID
func (c *DeliveryController) FindByID(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.URL.Path[len("/deliveries/id/"):])
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "ID inválido"})
		return
	}

	delivery, err := c.Service.FindByID(id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	if delivery == nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "Entrega não encontrada"})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(delivery)
}

// Busca entregas por cidade
func (c *DeliveryController) FindByCity(w http.ResponseWriter, r *http.Request) {
	cidade := r.URL.Query().Get("cidade")
	if cidade == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "O parâmetro 'cidade' é obrigatório"})
		return
	}

	deliveries, err := c.Service.FindByCity(cidade)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(deliveries)
}

func (c *DeliveryController) Update(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.URL.Path[len("/deliveries/"):])
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	var delivery models.Delivery
	if err := json.NewDecoder(r.Body).Decode(&delivery); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := c.Service.Update(id, delivery); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Entrega atualizada com sucesso!"})
}

func (c *DeliveryController) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.URL.Path[len("/deliveries/"):])
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest)
		return
	}

	if err := c.Service.Delete(id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Entrega excluída com sucesso!"})
}
