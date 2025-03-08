package repositories

import (
	"database/sql"
	"meu-projeto/backend/models"
)

// ClientRepository é uma estrutura que contém métodos para interagir com a tabela de clientes no banco de dados.
type ClientRepository struct {
	DB *sql.DB // Conexão com o banco de dados
}

// Create insere um novo cliente no banco de dados.
func (repo *ClientRepository) Create(client *models.Cliente) error {
	// Query SQL para inserir um novo cliente
	query := `INSERT INTO Cliente (nome, cpf, email, telefone) VALUES (?, ?, ?, ?)`

	// Executa a query com os valores do cliente
	result, err := repo.DB.Exec(query, client.Nome, client.CPF, client.Email, client.Telefone)
	if err != nil {
		return err // Retorna erro se a execução falhar
	}

	// Obtém o ID gerado para o novo cliente
	id, err := result.LastInsertId()
	if err != nil {
		return err // Retorna erro se não for possível obter o ID
	}

	// Atribui o ID gerado ao cliente
	client.ID = int(id)
	return nil
}

// List retorna uma lista de todos os clientes cadastrados no banco de dados.
func (repo *ClientRepository) List() ([]models.Cliente, error) {
	// Query SQL para selecionar todos os clientes
	rows, err := repo.DB.Query("SELECT id, nome, cpf, email, telefone FROM Cliente")
	if err != nil {
		return nil, err // Retorna erro se a query falhar
	}
	defer rows.Close() // Garante que as linhas sejam fechadas após o uso

	var clients []models.Cliente
	// Itera sobre as linhas retornadas pela query
	for rows.Next() {
		var client models.Cliente
		// Escaneia os valores da linha para a estrutura Cliente
		if err := rows.Scan(&client.ID, &client.Nome, &client.CPF, &client.Email, &client.Telefone); err != nil {
			return nil, err // Retorna erro se o scan falhar
		}
		// Adiciona o cliente à lista
		clients = append(clients, client)
	}
	return clients, nil
}

// FindByID busca um cliente pelo ID no banco de dados.
func (repo *ClientRepository) FindByID(id int) (*models.Cliente, error) {
	var client models.Cliente
	// Query SQL para selecionar um cliente pelo ID
	query := `SELECT id, nome, cpf, email, telefone FROM Cliente WHERE id = ?`

	// Executa a query e escaneia o resultado para a estrutura Cliente
	err := repo.DB.QueryRow(query, id).Scan(&client.ID, &client.Nome, &client.CPF, &client.Email, &client.Telefone)
	if err != nil {
		return nil, err // Retorna erro se o cliente não for encontrado ou se houver outro erro
	}
	return &client, nil
}

// Update atualiza os dados de um cliente no banco de dados.
func (repo *ClientRepository) Update(client *models.Cliente) error {
	// Query SQL para atualizar um cliente
	query := `UPDATE Cliente SET nome = ?, cpf = ?, email = ?, telefone = ? WHERE id = ?`

	// Executa a query com os valores atualizados do cliente
	_, err := repo.DB.Exec(query, client.Nome, client.CPF, client.Email, client.Telefone, client.ID)
	return err // Retorna erro se a execução falhar
}

// Delete remove um cliente e suas entregas associadas do banco de dados.
func (repo *ClientRepository) Delete(clientID int) error {
	// Inicia uma transação
	tx, err := repo.DB.Begin()
	if err != nil {
		return err // Retorna erro se não for possível iniciar a transação
	}

	// Deleta as entregas vinculadas ao cliente
	_, err = tx.Exec("DELETE FROM Entrega WHERE cliente_id = ?", clientID)
	if err != nil {
		tx.Rollback() // Desfaz a transação em caso de erro
		return err
	}

	// Deleta o cliente
	_, err = tx.Exec("DELETE FROM Cliente WHERE id = ?", clientID)
	if err != nil {
		tx.Rollback() // Desfaz a transação em caso de erro
		return err
	}

	// Confirma a transação
	return tx.Commit()
}
