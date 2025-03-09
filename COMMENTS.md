
# Comentários e Decisões de Design

Este arquivo contém informações sobre as decisões de design, arquitetura e bibliotecas utilizadas no projeto, além de comentários sobre o processo de desenvolvimento.

## Arquitetura do Projeto

O projeto foi desenvolvido seguindo uma arquitetura **MVC (Model-View-Controller)** para o backend em Golang, com o frontend em Next.js consumindo a API RESTful. O banco de dados MySQL foi escolhido por sua robustez e facilidade de integração com Golang.

### Backend (Golang)

- **Framework**: Utilizei o **HTTP** para criar a API RESTful, devido à sua simplicidade e performance.
- **Conexão com o Banco de Dados**: Para a conexão com o MySQL.
- **Validações**: As validações dos campos do formulário foram implementadas utilizando validações customizadas.

### Frontend (Next.js)

- **Integração com API**: O frontend consome a API Golang para buscar e exibir as entregas. Utilizei **fetch** para fazer as requisições HTTP.
- **Formulário**: O formulário de cadastro de entregas foi desenvolvido com validações em tempo real, garantindo que todos os campos obrigatórios sejam preenchidos corretamente.

### Docker

- **Containerização**: O projeto foi containerizado utilizando Docker, com três serviços principais: `backend`, `frontend` e `db` (MySQL). Isso facilita a execução do projeto em diferentes ambientes.
- **Docker Compose**: Utilizei o Docker Compose para orquestrar os containers e garantir que todos os serviços sejam iniciados corretamente.

## Documentação Prévia

### Análise de Requisitos

Antes de iniciar o desenvolvimento, foi realizada uma análise detalhada dos requisitos do projeto, com foco nas funcionalidades principais:

1. **Cadastro de Entregas**: O sistema deve permitir o cadastro de entregas com informações detalhadas, incluindo endereço e geolocalização.
2. **Edição e Exclusão**: O usuário deve poder editar e excluir entregas existentes.
3. **Listagem e Filtros**: As entregas devem ser listadas em uma tabela e exibidas em um mapa, com opções de filtro por ID e cidade.

### Modelagem do Banco de Dados

O banco de dados foi modelado com duas tabelas `Entrega` e `Cliente`, que armazena todas as informações das entregas. A estrutura da tabela é a seguinte:

```sql
CREATE TABLE IF NOT EXISTS Entrega (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    peso DECIMAL(10, 2) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    logradouro VARCHAR(100) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    complemento VARCHAR(100),
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    pais VARCHAR(50) NOT NULL,
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES Cliente(id)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

```sql
CREATE TABLE IF NOT EXISTS Cliente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    email VARCHAR(100),
    telefone VARCHAR(20)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
