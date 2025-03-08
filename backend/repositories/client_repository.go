package repositories

import (
	"database/sql"
	"meu-projeto/backend/models"
)

type ClientRepository struct {
	DB *sql.DB
}

func (repo *ClientRepository) Create(client *models.Cliente) error {
	query := `INSERT INTO Cliente (nome, cpf, email, telefone) VALUES (?, ?, ?, ?)`
	result, err := repo.DB.Exec(query, client.Nome, client.CPF, client.Email, client.Telefone)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	client.ID = int(id)
	return nil
}

func (repo *ClientRepository) List() ([]models.Cliente, error) {
	rows, err := repo.DB.Query("SELECT id, nome, cpf, email, telefone FROM Cliente")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var clients []models.Cliente
	for rows.Next() {
		var client models.Cliente
		if err := rows.Scan(&client.ID, &client.Nome, &client.CPF, &client.Email, &client.Telefone); err != nil {
			return nil, err
		}
		clients = append(clients, client)
	}
	return clients, nil
}

func (repo *ClientRepository) FindByID(id int) (*models.Cliente, error) {
	var client models.Cliente
	query := `SELECT id, nome, cpf, email, telefone FROM Cliente WHERE id = ?`
	err := repo.DB.QueryRow(query, id).Scan(&client.ID, &client.Nome, &client.CPF, &client.Email, &client.Telefone)
	if err != nil {
		return nil, err
	}
	return &client, nil
}

func (repo *ClientRepository) Update(client *models.Cliente) error {
	query := `UPDATE Cliente SET nome = ?, cpf = ?, email = ?, telefone = ? WHERE id = ?`
	_, err := repo.DB.Exec(query, client.Nome, client.CPF, client.Email, client.Telefone, client.ID)
	return err
}

func (repo *ClientRepository) Delete(clientID int) error {
	// Inicia uma transação
	tx, err := repo.DB.Begin()
	if err != nil {
		return err
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
