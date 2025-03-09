# Desafio Técnico - Desenvolvedor Full-Stack

Este repositório contém a solução para o desafio técnico proposto, que consiste em um sistema de gerenciamento de entregas com funcionalidades de cadastro, edição, exclusão e listagem de clientes. O projeto foi desenvolvido utilizando as seguintes tecnologias:

- **Backend**: Golang
- **Banco de Dados**: MySQL
- **Frontend**: Next.js
- **Docker**: Para containerização e facilidade de deploy

## Funcionalidades

O sistema permite que o usuário:

- Cadastre clientes com informações detalhadas, incluindo endereço e geolocalização.
- Edite clientes existentes.
- Exclua clientes.
- Liste todos os clientes cadastrados em uma tabela e visualize-os em um mapa.

## Endpoints da API

A API foi desenvolvida em Golang e oferece os seguintes endpoints:

1. **POST /deliveries**: Cadastra uma nova entrega.
2. **GET /deliveries**: Retorna todas as entregas cadastradas, com opções de filtro por ID e cidade.
3. **DELETE /deliveries**: Exclui uma entrega específica ou todas as entregas.
4. **PUT /deliveries**: Edita uma entrega existente.

A documentação completa da API, incluindo exemplos de requisições e respostas, está disponível via **Swagger**.

## Frontend

O frontend foi desenvolvido em Next.js e consome a API para exibir as entregas em uma tabela e em um mapa interativo. O usuário pode preencher um formulário para cadastrar novas entregas, e o sistema utiliza a API do Google Maps para realizar o **reverse geocoding**, preenchendo automaticamente os campos de latitude e longitude.

## Docker

O projeto foi containerizado utilizando Docker, com containers separados para o backend, frontend e banco de dados. Isso facilita a execução do projeto em qualquer ambiente.

## Como Executar o Projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/alenrique/Gerenciamento-de-entregas.git
2. Navegue até a pasta do projeto:
   ```bash
   cd Gerenciamento\ de\ entregas/
3. Crie o banco de dados:
   - 3.1 Abra o MySQL.
   - 3.2 Crie o banco de dados, as tabelas e as inserções
3. Entre na pasta do back-end:
   ```bash
   cd backend/
4. Rode a API:
   ```bash
   go run main.go
5. Abra outro terminal e entre na pasta do front-end:
   ```bash
   cd frontend/
6. Rode o front-end
   ```bash
   npm run dev
7. Acesse o frontend no navegador:
   ```bash
   http://localhost:3000
8. Acesse a documentação da API (Swagger) em:
   ```bash
   http://localhost:8080/swagger

## Como Executar o Projeto (Docker)

1. Clone o repositório:
   ```bash
   git clone https://github.com/alenrique/Gerenciamento-de-entregas.git
2. Navegue até a pasta do projeto:
   ```bash
   cd Gerenciamento\ de\ entregas/
3. Execute o Docker Compose para subir os containers:
   ```bash
   sudo docker-compose up --build
4. Acesse o frontend no navegador:
   ```bash
   http://localhost:3000
5. Acesse a documentação da API (Swagger) em:
   ```bash
   http://localhost:8080/swagger

## Testes

Foram implementados testes unitários e de integração para garantir a qualidade do código. A cobertura de testes foi priorizada, buscando atingir o máximo possível de cobertura.

## Documentação

A documentação do preparo antes de iniciar o código foi feita em LaTEX pelo Overleaf e pode ser acessado através de [Pasta Google Drive](https://drive.google.com/drive/folders/13lG19v-kpThh3l37km4Xg3aQi4JOC5tH?usp=sharing)

## Documentação Adicional

Para mais detalhes sobre a arquitetura, decisões de design e bibliotecas utilizadas, consulte o arquivo COMMENTS.md.

## Quadro Kanban (Trello)

Durante o desenvolvimento, utilizei um quadro Kanban no Trello para organizar as tarefas. O quadro foi dividido em colunas como To Do, In Progress, Testing e Done, e cada tarefa foi detalhada com descrições e prazos. Isso ajudou a manter o projeto organizado e garantir que todas as funcionalidades fossem implementadas dentro do prazo, o quadro Kanban pode ser acessado em [Trello](https://trello.com/invite/b/67c98956815ac3477267623e/ATTI54890bcbeade84a342cfe0ac3c87a935D100E40A/gerenciamento-de-entregas).

## Conclusão

O projeto foi desenvolvido com foco em boas práticas de código, organização e documentação. A utilização de Docker facilitou a execução e o deploy do projeto, enquanto o quadro Kanban no Trello ajudou a manter o desenvolvimento organizado e dentro do prazo.
