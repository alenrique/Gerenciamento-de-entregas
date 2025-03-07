package services

import (
	"meu-projeto/backend/models"
	"meu-projeto/backend/repositories"
)

type DeliveryService struct {
	Repository *repositories.DeliveryRepository
}

// Cria uma nova entrega
func (s *DeliveryService) Create(delivery models.Delivery, cliente models.Cliente) (int64, error) {
	// Verifica se o cliente já existe pelo CPF
	existingCliente, err := s.Repository.FindByCPF(cliente.CPF)
	if err != nil {
		return 0, err
	}

	var clienteID int64
	if existingCliente == nil {
		// Cliente não existe, cria um novo
		clienteID, err = s.Repository.CreateCliente(cliente)
		if err != nil {
			return 0, err
		}
	} else {
		// Cliente já existe, usa o ID existente
		clienteID = int64(existingCliente.ID)
	}

	// Associa o cliente à entrega
	delivery.ClienteID = int(clienteID)

	// Cria a entrega
	return s.Repository.Create(delivery)
}

// Lista todas as entregas
func (s *DeliveryService) List() ([]models.Delivery, error) {
	return s.Repository.List()
}

// Busca uma entrega por ID
func (s *DeliveryService) FindByID(id int) (*models.Delivery, error) {
	return s.Repository.FindByID(id)
}

// Busca entregas por cidade
func (s *DeliveryService) FindByCity(cidade string) ([]models.Delivery, error) {
	return s.Repository.FindByCity(cidade)
}

// Atualiza uma entrega
func (s *DeliveryService) Update(id int, delivery models.Delivery) error {
	return s.Repository.Update(id, delivery)
}

// Exclui uma entrega
func (s *DeliveryService) Delete(id int) error {
	return s.Repository.Delete(id)
}
