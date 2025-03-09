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

// Create godoc
// @Summary Cria um novo cliente
// @Description Cria um novo cliente no sistema.
// @Accept json
// @Produce json
// @Param cliente body models.Cliente true "Dados do cliente"
// @Success 201 {object} models.Cliente
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /clients [post]
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

// List godoc
// @Summary Lista todos os clientes
// @Description Retorna uma lista de todos os clientes cadastrados.
// @Produce json
// @Success 200 {array} models.Cliente
// @Failure 500 {object} map[string]string
// @Router /clients [get]
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

// FindByID godoc
// @Summary Busca um cliente pelo ID
// @Description Retorna os detalhes de um cliente específico com base no ID.
// @Produce json
// @Param id path int true "ID do cliente"
// @Success 200 {object} models.Cliente
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /clients/id/{id} [get]
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

// Update godoc
// @Summary Atualiza um cliente
// @Description Atualiza os dados de um cliente existente.
// @Accept json
// @Produce json
// @Param cliente body models.Cliente true "Dados do cliente"
// @Success 200 {object} models.Cliente
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /clients [put]
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

// Delete godoc
// @Summary Exclui um cliente
// @Description Exclui um cliente pelo ID.
// @Produce json
// @Param id path int true "ID do cliente"
// @Success 204 "No Content"
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /clients/{id} [delete]
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
