# Usa uma imagem base do Golang
FROM golang:1.24.1-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o código fonte para o diretório de trabalho
COPY . .

# Baixa as dependências do Go
RUN go mod download

# Compila o aplicativo
RUN go build -o main .

# Expõe a porta que o aplicativo vai rodar
EXPOSE 8080

# Comando para rodar o aplicativo
CMD ["./main"]