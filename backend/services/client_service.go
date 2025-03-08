package services

import (
	"meu-projeto/backend/models"
	"meu-projeto/backend/repositories"
)

// ClientService é uma estrutura que contém métodos para lidar com a lógica de negócio relacionada a clientes.
type ClientService struct {
	Repository *repositories.ClientRepository // Repositório para interagir com o banco de dados
}

// Create cria um novo cliente no banco de dados.
func (service *ClientService) Create(client *models.Cliente) error {
	// Chama o método Create do repositório para inserir o cliente no banco de dados
	return service.Repository.Create(client)
}

// List retorna uma lista de todos os clientes cadastrados no banco de dados.
func (service *ClientService) List() ([]models.Cliente, error) {
	// Chama o método List do repositório para obter a lista de clientes
	return service.Repository.List()
}

// FindByID busca um cliente pelo ID no banco de dados.
func (service *ClientService) FindByID(id int) (*models.Cliente, error) {
	// Chama o método FindByID do repositório para buscar o cliente pelo ID
	return service.Repository.FindByID(id)
}

// Update atualiza os dados de um cliente no banco de dados.
func (service *ClientService) Update(client *models.Cliente) error {
	// Chama o método Update do repositório para atualizar o cliente no banco de dados
	return service.Repository.Update(client)
}

// Delete remove um cliente do banco de dados.
func (service *ClientService) Delete(id int) error {
	// Chama o método Delete do repositório para deletar o cliente pelo ID
	return service.Repository.Delete(id)
}
