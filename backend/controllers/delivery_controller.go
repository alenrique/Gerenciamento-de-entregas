package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"meu-projeto/backend/models"
	"meu-projeto/backend/services"
	"meu-projeto/backend/utils"
)

// DeliveryController é responsável por lidar com as requisições HTTP relacionadas à entidade "Delivery" (Entregas).
type DeliveryController struct {
	Service *services.DeliveryService // Serviço que contém a lógica de negócio para entregas
}

// Create godoc
// @Summary Cria uma nova entrega
// @Description Cria uma nova entrega associada a um cliente.
// @Accept json
// @Produce json
// @Param delivery body models.Delivery true "Dados da entrega"
// @Param cliente body models.Cliente true "Dados do cliente"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /deliveries [post]
func (c *DeliveryController) Create(w http.ResponseWriter, r *http.Request) {
	var request struct {
		Delivery models.Delivery `json:"delivery"` // Dados da entrega
		Cliente  models.Cliente  `json:"cliente"`  // Dados do cliente associado à entrega
	}

	// Decodifica o corpo da requisição JSON para a struct request
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		w.WriteHeader(http.StatusBadRequest) // Retorna erro 400 se o JSON for inválido
		json.NewEncoder(w).Encode(map[string]string{"error": "Erro ao decodificar o JSON"})
		return
	}

	// Validação do formato do CPF do cliente
	if !utils.ValidateCPF(request.Cliente.CPF) {
		w.WriteHeader(http.StatusBadRequest) // Retorna erro 400 se o CPF for inválido
		json.NewEncoder(w).Encode(map[string]string{"error": "CPF inválido"})
		return
	}

	// Validação dos campos obrigatórios da entrega
	if request.Delivery.Peso <= 0 {
		w.WriteHeader(http.StatusBadRequest) // Retorna erro 400 se o peso for inválido
		json.NewEncoder(w).Encode(map[string]string{"error": "O campo 'peso' é obrigatório e deve ser maior que zero"})
		return
	}
	if request.Delivery.Endereco == "" {
		w.WriteHeader(http.StatusBadRequest) // Retorna erro 400 se o endereço estiver vazio
		json.NewEncoder(w).Encode(map[string]string{"error": "O campo 'endereco' é obrigatório"})
		return
	}
	if request.Delivery.Cidade == "" {
		w.WriteHeader(http.StatusBadRequest) // Retorna erro 400 se a cidade estiver vazia
		json.NewEncoder(w).Encode(map[string]string{"error": "O campo 'cidade' é obrigatório"})
		return
	}

	// Validação dos campos obrigatórios do cliente
	if request.Cliente.Nome == "" {
		w.WriteHeader(http.StatusBadRequest) // Retorna erro 400 se o nome do cliente estiver vazio
		json.NewEncoder(w).Encode(map[string]string{"error": "O campo 'nome' do cliente é obrigatório"})
		return
	}
	if request.Cliente.CPF == "" {
		w.WriteHeader(http.StatusBadRequest) // Retorna erro 400 se o CPF do cliente estiver vazio
		json.NewEncoder(w).Encode(map[string]string{"error": "O campo 'cpf' do cliente é obrigatório"})
		return
	}

	// Chama o serviço para criar a entrega e o cliente no banco de dados
	id, err := c.Service.Create(request.Delivery, request.Cliente)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError) // Retorna erro 500 se houver falha no serviço
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	// Retorna o status 200 (OK) e uma mensagem de sucesso com o ID da entrega criada
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{"id": id, "message": "Entrega cadastrada com sucesso!", "success": true})
}

// List godoc
// @Summary Lista todas as entregas
// @Description Retorna uma lista de todas as entregas cadastradas.
// @Produce json
// @Success 200 {array} models.Delivery
// @Failure 500 {object} map[string]string
// @Router /deliveries [get]
func (c *DeliveryController) List(w http.ResponseWriter, r *http.Request) {
	// Chama o serviço para obter a lista de entregas
	deliveries, err := c.Service.List()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError) // Retorna erro 500 se houver falha no serviço
		return
	}

	// Retorna o status 200 (OK) e a lista de entregas no corpo da resposta
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(deliveries)
}

// FindByID godoc
// @Summary Busca uma entrega pelo ID
// @Description Retorna os detalhes de uma entrega específica com base no ID.
// @Produce json
// @Param id path int true "ID da entrega"
// @Success 200 {object} models.Delivery
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /deliveries/id/{id} [get]
func (c *DeliveryController) FindByID(w http.ResponseWriter, r *http.Request) {
	// Extrai o ID da URL (ex: "/deliveries/id/1" -> "1")
	id, err := strconv.Atoi(r.URL.Path[len("/deliveries/id/"):])
	if err != nil {
		w.WriteHeader(http.StatusBadRequest) // Retorna erro 400 se o ID for inválido
		json.NewEncoder(w).Encode(map[string]string{"error": "ID inválido"})
		return
	}

	// Chama o serviço para buscar a entrega pelo ID
	delivery, err := c.Service.FindByID(id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError) // Retorna erro 500 se houver falha no serviço
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	if delivery == nil {
		w.WriteHeader(http.StatusNotFound) // Retorna erro 404 se a entrega não for encontrada
		json.NewEncoder(w).Encode(map[string]string{"error": "Entrega não encontrada"})
		return
	}

	// Retorna o status 200 (OK) e a entrega encontrada no corpo da resposta
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(delivery)
}

// FindByCity godoc
// @Summary Busca entregas por cidade
// @Description Retorna uma lista de entregas filtradas por cidade.
// @Produce json
// @Param cidade query string true "Nome da cidade"
// @Success 200 {array} models.Delivery
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /deliveries/city [get]
func (c *DeliveryController) FindByCity(w http.ResponseWriter, r *http.Request) {
	// Extrai o parâmetro "cidade" da query string
	cidade := r.URL.Query().Get("cidade")
	if cidade == "" {
		w.WriteHeader(http.StatusBadRequest) // Retorna erro 400 se o parâmetro "cidade" estiver vazio
		json.NewEncoder(w).Encode(map[string]string{"error": "O parâmetro 'cidade' é obrigatório"})
		return
	}

	// Chama o serviço para buscar as entregas por cidade
	deliveries, err := c.Service.FindByCity(cidade)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError) // Retorna erro 500 se houver falha no serviço
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	// Retorna o status 200 (OK) e a lista de entregas no corpo da resposta
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(deliveries)
}

// Update godoc
// @Summary Atualiza uma entrega
// @Description Atualiza os dados de uma entrega existente.
// @Accept json
// @Produce json
// @Param id path int true "ID da entrega"
// @Param delivery body models.Delivery true "Dados da entrega"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /deliveries/{id} [put]
func (c *DeliveryController) Update(w http.ResponseWriter, r *http.Request) {
	// Extrai o ID da URL (ex: "/deliveries/1" -> "1")
	id, err := strconv.Atoi(r.URL.Path[len("/deliveries/"):])
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest) // Retorna erro 400 se o ID for inválido
		return
	}

	// Decodifica o corpo da requisição JSON para a struct Delivery
	var delivery models.Delivery
	if err := json.NewDecoder(r.Body).Decode(&delivery); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest) // Retorna erro 400 se o JSON for inválido
		return
	}

	// Chama o serviço para atualizar a entrega no banco de dados
	if err := c.Service.Update(id, delivery); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError) // Retorna erro 500 se houver falha no serviço
		return
	}

	// Retorna o status 200 (OK) e uma mensagem de sucesso
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Entrega atualizada com sucesso!"})
}

// Delete godoc
// @Summary Exclui uma entrega
// @Description Exclui uma entrega pelo ID.
// @Produce json
// @Param id path int true "ID da entrega"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /deliveries/{id} [delete]
func (c *DeliveryController) Delete(w http.ResponseWriter, r *http.Request) {
	// Extrai o ID da URL (ex: "/deliveries/1" -> "1")
	id, err := strconv.Atoi(r.URL.Path[len("/deliveries/"):])
	if err != nil {
		http.Error(w, "ID inválido", http.StatusBadRequest) // Retorna erro 400 se o ID for inválido
		return
	}

	// Chama o serviço para deletar a entrega pelo ID
	if err := c.Service.Delete(id); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError) // Retorna erro 500 se houver falha no serviço
		return
	}

	// Retorna o status 200 (OK) e uma mensagem de sucesso
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Entrega excluída com sucesso!"})
}
