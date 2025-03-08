package services

import (
	"meu-projeto/backend/models"
	"meu-projeto/backend/repositories"
)

type ClientService struct {
	Repository *repositories.ClientRepository
}

func (service *ClientService) Create(client *models.Cliente) error {
	return service.Repository.Create(client)
}

func (service *ClientService) List() ([]models.Cliente, error) {
	return service.Repository.List()
}

func (service *ClientService) FindByID(id int) (*models.Cliente, error) {
	return service.Repository.FindByID(id)
}

func (service *ClientService) Update(client *models.Cliente) error {
	return service.Repository.Update(client)
}

func (service *ClientService) Delete(id int) error {
	return service.Repository.Delete(id)
}
