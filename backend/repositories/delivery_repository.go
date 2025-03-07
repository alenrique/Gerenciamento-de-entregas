package repositories

import (
	"database/sql"
	"meu-projeto/backend/models"
)

type DeliveryRepository struct {
	DB *sql.DB
}

func (r *DeliveryRepository) FindByCPF(cpf string) (*models.Cliente, error) {
	var cliente models.Cliente
	query := "SELECT id, nome, email, telefone, cpf FROM Cliente WHERE cpf = ?"
	err := r.DB.QueryRow(query, cpf).Scan(&cliente.ID, &cliente.Nome, &cliente.Email, &cliente.Telefone, &cliente.CPF)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // Cliente não encontrado
		}
		return nil, err
	}
	return &cliente, nil
}

func (r *DeliveryRepository) CreateCliente(cliente models.Cliente) (int64, error) {
	query := "INSERT INTO Cliente (nome, email, telefone, cpf) VALUES (?, ?, ?, ?)"
	result, err := r.DB.Exec(query, cliente.Nome, cliente.Email, cliente.Telefone, cliente.CPF)
	if err != nil {
		return 0, err
	}
	return result.LastInsertId()
}

// Cria uma nova entrega
func (r *DeliveryRepository) Create(delivery models.Delivery) (int64, error) {
	query := `INSERT INTO Entrega (cliente_id, peso, endereco, logradouro, numero, bairro, complemento, cidade, estado, pais, latitude, longitude) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
	result, err := r.DB.Exec(query, delivery.ClienteID, delivery.Peso, delivery.Endereco, delivery.Logradouro, delivery.Numero, delivery.Bairro, delivery.Complemento, delivery.Cidade, delivery.Estado, delivery.Pais, delivery.Latitude, delivery.Longitude)
	if err != nil {
		return 0, err
	}
	return result.LastInsertId()
}

// Lista todas as entregas
func (r *DeliveryRepository) List() ([]models.Delivery, error) {
	rows, err := r.DB.Query("SELECT id, cliente_id, peso, endereco, logradouro, numero, bairro, complemento, cidade, estado, pais, latitude, longitude FROM Entrega")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var deliveries []models.Delivery
	for rows.Next() {
		var delivery models.Delivery
		err := rows.Scan(&delivery.ID, &delivery.ClienteID, &delivery.Peso, &delivery.Endereco, &delivery.Logradouro, &delivery.Numero, &delivery.Bairro, &delivery.Complemento, &delivery.Cidade, &delivery.Estado, &delivery.Pais, &delivery.Latitude, &delivery.Longitude)
		if err != nil {
			return nil, err
		}
		deliveries = append(deliveries, delivery)
	}
	return deliveries, nil
}

// Busca uma entrega por ID
func (r *DeliveryRepository) FindByID(id int) (*models.Delivery, error) {
	var delivery models.Delivery
	query := "SELECT id, cliente_id, peso, endereco, logradouro, numero, bairro, complemento, cidade, estado, pais, latitude, longitude FROM Entrega WHERE id = ?"
	err := r.DB.QueryRow(query, id).Scan(&delivery.ID, &delivery.ClienteID, &delivery.Peso, &delivery.Endereco, &delivery.Logradouro, &delivery.Numero, &delivery.Bairro, &delivery.Complemento, &delivery.Cidade, &delivery.Estado, &delivery.Pais, &delivery.Latitude, &delivery.Longitude)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // Entrega não encontrada
		}
		return nil, err
	}
	return &delivery, nil
}

// Busca entregas por cidade
func (r *DeliveryRepository) FindByCity(cidade string) ([]models.Delivery, error) {
	query := "SELECT id, cliente_id, peso, endereco, logradouro, numero, bairro, complemento, cidade, estado, pais, latitude, longitude FROM Entrega WHERE cidade = ?"
	rows, err := r.DB.Query(query, cidade)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var deliveries []models.Delivery
	for rows.Next() {
		var delivery models.Delivery
		err := rows.Scan(&delivery.ID, &delivery.ClienteID, &delivery.Peso, &delivery.Endereco, &delivery.Logradouro, &delivery.Numero, &delivery.Bairro, &delivery.Complemento, &delivery.Cidade, &delivery.Estado, &delivery.Pais, &delivery.Latitude, &delivery.Longitude)
		if err != nil {
			return nil, err
		}
		deliveries = append(deliveries, delivery)
	}
	return deliveries, nil
}

// Atualiza uma entrega
func (r *DeliveryRepository) Update(id int, delivery models.Delivery) error {
	query := `UPDATE Entrega SET cliente_id = ?, peso = ?, endereco = ?, logradouro = ?, numero = ?, bairro = ?, complemento = ?, cidade = ?, estado = ?, pais = ?, latitude = ?, longitude = ? WHERE id = ?`
	_, err := r.DB.Exec(query, delivery.ClienteID, delivery.Peso, delivery.Endereco, delivery.Logradouro, delivery.Numero, delivery.Bairro, delivery.Complemento, delivery.Cidade, delivery.Estado, delivery.Pais, delivery.Latitude, delivery.Longitude, id)
	return err
}

// Exclui uma entrega
func (r *DeliveryRepository) Delete(id int) error {
	query := "DELETE FROM Entrega WHERE id = ?"
	_, err := r.DB.Exec(query, id)
	return err
}
