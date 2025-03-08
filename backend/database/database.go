package database

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql" // Importa o driver MySQL (usamos _ para inicializar o driver sem referência direta)
	"github.com/joho/godotenv"         // Biblioteca para carregar variáveis de ambiente de um arquivo .env
)

// DB é uma variável global que armazenará a conexão com o banco de dados.
var DB *sql.DB

// InitDB inicializa a conexão com o banco de dados.
func InitDB() {
	// Carrega as variáveis de ambiente do arquivo .env
	if err := godotenv.Load(".env"); err != nil {
		log.Fatal("Erro ao carregar o arquivo .env") // Encerra o programa se o arquivo .env não for encontrado
	}

	// Recupera as variáveis de ambiente necessárias para a conexão com o banco de dados
	dbUser := os.Getenv("DB_USER")         // Usuário do banco de dados
	dbPassword := os.Getenv("DB_PASSWORD") // Senha do banco de dados
	dbHost := os.Getenv("DB_HOST")         // Host do banco de dados (ex: localhost)
	dbPort := os.Getenv("DB_PORT")         // Porta do banco de dados (ex: 3306)
	dbName := os.Getenv("DB_NAME")         // Nome do banco de dados

	// Monta a string de conexão com o banco de dados, incluindo o charset utf8mb4
	connectionString := dbUser + ":" + dbPassword + "@tcp(" + dbHost + ":" + dbPort + ")/" + dbName + "?charset=utf8mb4"

	var err error
	// Abre a conexão com o banco de dados usando o driver MySQL e a string de conexão
	DB, err = sql.Open("mysql", connectionString)
	if err != nil {
		log.Fatal(err) // Encerra o programa se houver erro ao abrir a conexão
	}

	// Testa a conexão com o banco de dados
	if err = DB.Ping(); err != nil {
		log.Fatal(err) // Encerra o programa se a conexão falhar
	}

	// Loga uma mensagem de sucesso ao estabelecer a conexão
	log.Println("Conexão com o banco de dados estabelecida!")
}
