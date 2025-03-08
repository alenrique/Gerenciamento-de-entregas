package repositories

import (
	"database/sql"
	"meu-projeto/backend/models"
)

// DeliveryRepository é uma estrutura que contém métodos para interagir com a tabela de entregas no banco de dados.
type DeliveryRepository struct {
	DB *sql.DB // Conexão com o banco de dados
}

// FindByCPF busca um cliente pelo CPF no banco de dados.
func (r *DeliveryRepository) FindByCPF(cpf string) (*models.Cliente, error) {
	var cliente models.Cliente
	// Query SQL para selecionar um cliente pelo CPF
	query := "SELECT id, nome, email, telefone, cpf FROM Cliente WHERE cpf = ?"

	// Executa a query e escaneia o resultado para a estrutura Cliente
	err := r.DB.QueryRow(query, cpf).Scan(&cliente.ID, &cliente.Nome, &cliente.Email, &cliente.Telefone, &cliente.CPF)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // Retorna nil se o cliente não for encontrado
		}
		return nil, err // Retorna erro se houver outro problema
	}
	return &cliente, nil
}

// CreateCliente insere um novo cliente no banco de dados.
func (r *DeliveryRepository) CreateCliente(cliente models.Cliente) (int64, error) {
	// Query SQL para inserir um novo cliente
	query := "INSERT INTO Cliente (nome, email, telefone, cpf) VALUES (?, ?, ?, ?)"

	// Executa a query com os valores do cliente
	result, err := r.DB.Exec(query, cliente.Nome, cliente.Email, cliente.Telefone, cliente.CPF)
	if err != nil {
		return 0, err // Retorna erro se a execução falhar
	}

	// Retorna o ID do cliente inserido
	return result.LastInsertId()
}

// Create insere uma nova entrega no banco de dados.
func (r *DeliveryRepository) Create(delivery models.Delivery) (int64, error) {
	// Query SQL para inserir uma nova entrega
	query := `INSERT INTO Entrega (cliente_id, peso, endereco, logradouro, numero, bairro, complemento, cidade, estado, pais, latitude, longitude) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	// Executa a query com os valores da entrega
	result, err := r.DB.Exec(query, delivery.ClienteID, delivery.Peso, delivery.Endereco, delivery.Logradouro, delivery.Numero, delivery.Bairro, delivery.Complemento, delivery.Cidade, delivery.Estado, delivery.Pais, delivery.Latitude, delivery.Longitude)
	if err != nil {
		return 0, err // Retorna erro se a execução falhar
	}

	// Retorna o ID da entrega inserida
	return result.LastInsertId()
}

// List retorna uma lista de todas as entregas cadastradas no banco de dados.
func (r *DeliveryRepository) List() ([]models.Delivery, error) {
	// Query SQL para selecionar todas as entregas
	rows, err := r.DB.Query("SELECT id, cliente_id, peso, endereco, logradouro, numero, bairro, complemento, cidade, estado, pais, latitude, longitude FROM Entrega")
	if err != nil {
		return nil, err // Retorna erro se a query falhar
	}
	defer rows.Close() // Garante que as linhas sejam fechadas após o uso

	var deliveries []models.Delivery
	// Itera sobre as linhas retornadas pela query
	for rows.Next() {
		var delivery models.Delivery
		// Escaneia os valores da linha para a estrutura Delivery
		err := rows.Scan(&delivery.ID, &delivery.ClienteID, &delivery.Peso, &delivery.Endereco, &delivery.Logradouro, &delivery.Numero, &delivery.Bairro, &delivery.Complemento, &delivery.Cidade, &delivery.Estado, &delivery.Pais, &delivery.Latitude, &delivery.Longitude)
		if err != nil {
			return nil, err // Retorna erro se o scan falhar
		}
		// Adiciona a entrega à lista
		deliveries = append(deliveries, delivery)
	}
	return deliveries, nil
}

// FindByID busca uma entrega pelo ID no banco de dados.
func (r *DeliveryRepository) FindByID(id int) (*models.Delivery, error) {
	var delivery models.Delivery
	// Query SQL para selecionar uma entrega pelo ID
	query := "SELECT id, cliente_id, peso, endereco, logradouro, numero, bairro, complemento, cidade, estado, pais, latitude, longitude FROM Entrega WHERE id = ?"

	// Executa a query e escaneia o resultado para a estrutura Delivery
	err := r.DB.QueryRow(query, id).Scan(&delivery.ID, &delivery.ClienteID, &delivery.Peso, &delivery.Endereco, &delivery.Logradouro, &delivery.Numero, &delivery.Bairro, &delivery.Complemento, &delivery.Cidade, &delivery.Estado, &delivery.Pais, &delivery.Latitude, &delivery.Longitude)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // Retorna nil se a entrega não for encontrada
		}
		return nil, err // Retorna erro se houver outro problema
	}
	return &delivery, nil
}

// FindByCity busca entregas por cidade no banco de dados.
func (r *DeliveryRepository) FindByCity(cidade string) ([]models.Delivery, error) {
	// Query SQL para selecionar entregas por cidade
	query := "SELECT id, cliente_id, peso, endereco, logradouro, numero, bairro, complemento, cidade, estado, pais, latitude, longitude FROM Entrega WHERE cidade = ?"

	// Executa a query
	rows, err := r.DB.Query(query, cidade)
	if err != nil {
		return nil, err // Retorna erro se a query falhar
	}
	defer rows.Close() // Garante que as linhas sejam fechadas após o uso

	var deliveries []models.Delivery
	// Itera sobre as linhas retornadas pela query
	for rows.Next() {
		var delivery models.Delivery
		// Escaneia os valores da linha para a estrutura Delivery
		err := rows.Scan(&delivery.ID, &delivery.ClienteID, &delivery.Peso, &delivery.Endereco, &delivery.Logradouro, &delivery.Numero, &delivery.Bairro, &delivery.Complemento, &delivery.Cidade, &delivery.Estado, &delivery.Pais, &delivery.Latitude, &delivery.Longitude)
		if err != nil {
			return nil, err // Retorna erro se o scan falhar
		}
		// Adiciona a entrega à lista
		deliveries = append(deliveries, delivery)
	}
	return deliveries, nil
}

// Update atualiza os dados de uma entrega no banco de dados.
func (r *DeliveryRepository) Update(id int, delivery models.Delivery) error {
	// Query SQL para atualizar uma entrega
	query := `UPDATE Entrega SET cliente_id = ?, peso = ?, endereco = ?, logradouro = ?, numero = ?, bairro = ?, complemento = ?, cidade = ?, estado = ?, pais = ?, latitude = ?, longitude = ? WHERE id = ?`

	// Executa a query com os valores atualizados da entrega
	_, err := r.DB.Exec(query, delivery.ClienteID, delivery.Peso, delivery.Endereco, delivery.Logradouro, delivery.Numero, delivery.Bairro, delivery.Complemento, delivery.Cidade, delivery.Estado, delivery.Pais, delivery.Latitude, delivery.Longitude, id)
	return err // Retorna erro se a execução falhar
}

// Delete remove uma entrega do banco de dados.
func (r *DeliveryRepository) Delete(id int) error {
	// Query SQL para deletar uma entrega
	query := "DELETE FROM Entrega WHERE id = ?"

	// Executa a query
	_, err := r.DB.Exec(query, id)
	return err // Retorna erro se a execução falhar
}
