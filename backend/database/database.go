package database

import (
	"database/sql"
	"log"
	"os"
	"path/filepath"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

var DB *sql.DB

func InitDB() {
	// Obtém o caminho absoluto para o arquivo .env
	envPath := filepath.Join("backend", ".env")

	// Carrega as variáveis de ambiente do arquivo .env
	if err := godotenv.Load(envPath); err != nil {
		log.Fatal("Erro ao carregar o arquivo .env")
	}

	// Recupera as variáveis de ambiente
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	// Monta a string de conexão
	connectionString := dbUser + ":" + dbPassword + "@tcp(" + dbHost + ":" + dbPort + ")/" + dbName

	var err error
	DB, err = sql.Open("mysql", connectionString)
	if err != nil {
		log.Fatal(err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal(err)
	}

	log.Println("Conexão com o banco de dados estabelecida!")
}
