package services

import (
	"meu-projeto/backend/models"
	"meu-projeto/backend/repositories"
)

// DeliveryService é uma estrutura que contém métodos para lidar com a lógica de negócio relacionada a entregas.
type DeliveryService struct {
	Repository *repositories.DeliveryRepository // Repositório para interagir com o banco de dados
}

// Create cria uma nova entrega no banco de dados.
func (s *DeliveryService) Create(delivery models.Delivery, cliente models.Cliente) (int64, error) {
	// Verifica se o cliente já existe pelo CPF
	existingCliente, err := s.Repository.FindByCPF(cliente.CPF)
	if err != nil {
		return 0, err // Retorna erro se houver problema ao buscar o cliente
	}

	var clienteID int64
	if existingCliente == nil {
		// Cliente não existe, cria um novo
		clienteID, err = s.Repository.CreateCliente(cliente)
		if err != nil {
			return 0, err // Retorna erro se houver problema ao criar o cliente
		}
	} else {
		// Cliente já existe, usa o ID existente
		clienteID = int64(existingCliente.ID)
	}

	// Associa o cliente à entrega
	delivery.ClienteID = int(clienteID)

	// Cria a entrega no banco de dados
	return s.Repository.Create(delivery)
}

// List retorna uma lista de todas as entregas cadastradas no banco de dados.
func (s *DeliveryService) List() ([]models.Delivery, error) {
	// Chama o método List do repositório para obter a lista de entregas
	return s.Repository.List()
}

// FindByID busca uma entrega pelo ID no banco de dados.
func (s *DeliveryService) FindByID(id int) (*models.Delivery, error) {
	// Chama o método FindByID do repositório para buscar a entrega pelo ID
	return s.Repository.FindByID(id)
}

// FindByCity busca entregas por cidade no banco de dados.
func (s *DeliveryService) FindByCity(cidade string) ([]models.Delivery, error) {
	// Chama o método FindByCity do repositório para buscar entregas por cidade
	return s.Repository.FindByCity(cidade)
}

// Update atualiza os dados de uma entrega no banco de dados.
func (s *DeliveryService) Update(id int, delivery models.Delivery) error {
	// Chama o método Update do repositório para atualizar a entrega
	return s.Repository.Update(id, delivery)
}

// Delete remove uma entrega do banco de dados.
func (s *DeliveryService) Delete(id int) error {
	// Chama o método Delete do repositório para deletar a entrega
	return s.Repository.Delete(id)
}
