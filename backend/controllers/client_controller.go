package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"meu-projeto/backend/models"
	"meu-projeto/backend/services"
)

// ClientController é responsável por lidar com as requisições HTTP relacionadas à entidade "Cliente".
type ClientController struct {
	Service *services.ClientService // Serviço que contém a lógica de negócio para clientes
}

// Create lida com a requisição para criar um novo cliente.
func (controller *ClientController) Create(w http.ResponseWriter, r *http.Request) {
	var client models.Cliente

	// Decodifica o corpo da requisição JSON para a struct Cliente
	if err := json.NewDecoder(r.Body).Decode(&client); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest) // Retorna erro 400 se o JSON for inválido
		return
	}

	// Chama o serviço para criar o cliente no banco de dados
	if err := controller.Service.Create(&client); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError) // Retorna erro 500 se houver falha no serviço
		return
	}

	// Retorna o status 201 (Created) e o cliente criado no corpo da resposta
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(client)
}

// List lida com a requisição para listar todos os clientes.
func (controller *ClientController) List(w http.ResponseWriter, r *http.Request) {
	// Chama o serviço para obter a lista de clientes
	clients, err := controller.Service.List()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError) // Retorna erro 500 se houver falha no serviço
		return
	}

	// Retorna o status 200 (OK) e a lista de clientes no corpo da resposta
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(clients)
}

// FindByID lida com a requisição para buscar um cliente pelo ID.
func (controller *ClientController) FindByID(w http.ResponseWriter, r *http.Request) {
	// Extrai o ID da URL (ex: "/clients/id/1" -> "1")
	idStr := r.URL.Path[len("/clients/id/"):]
	id, err := strconv.Atoi(idStr) // Converte o ID de string para int
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest) // Retorna erro 400 se o ID for inválido
		return
	}

	// Chama o serviço para buscar o cliente pelo ID
	client, err := controller.Service.FindByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound) // Retorna erro 404 se o cliente não for encontrado
		return
	}

	// Retorna o status 200 (OK) e o cliente encontrado no corpo da resposta
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(client)
}

// Update lida com a requisição para atualizar um cliente existente.
func (controller *ClientController) Update(w http.ResponseWriter, r *http.Request) {
	var client models.Cliente

	// Decodifica o corpo da requisição JSON para a struct Cliente
	if err := json.NewDecoder(r.Body).Decode(&client); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest) // Retorna erro 400 se o JSON for inválido
		return
	}

	// Chama o serviço para atualizar o cliente no banco de dados
	if err := controller.Service.Update(&client); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError) // Retorna erro 500 se houver falha no serviço
		return
	}

	// Retorna o status 200 (OK) e o cliente atualizado no corpo da resposta
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(client)
}

// Delete lida com a requisição para deletar um cliente pelo ID.
func (controller *ClientController) Delete(w http.ResponseWriter, r *http.Request) {
	// Extrai o ID da URL (ex: "/clients/1" -> "1")
	idStr := r.URL.Path[len("/clients/"):]
	id, err := strconv.Atoi(idStr) // Converte o ID de string para int
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest) // Retorna erro 400 se o ID for inválido
		return
	}

	// Chama o serviço para deletar o cliente pelo ID
	if err := controller.Service.Delete(id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError) // Retorna erro 500 se houver falha no serviço
		return
	}

	// Retorna o status 204 (No Content) para indicar que o cliente foi deletado com sucesso
	w.WriteHeader(http.StatusNoContent)
}
