# API de Gerenciamento de Pedidos e Produtos

Uma API RESTful robusta para o gerenciamento de pedidos e produtos, desenvolvida com NestJS e SQLite, seguindo boas práticas de desenvolvimento e organização de código.

## Descrição do Projeto

Esta API backend fornece operações essenciais para gerenciar produtos e o fluxo de criação e gestão de pedidos, incluindo controle de estoque. A aplicação foi desenvolvida utilizando:

- **Node.js com NestJS**: Framework robusto para construção de aplicações server-side
- **SQLite**: Banco de dados leve e eficiente
- **TypeORM**: ORM para interação com o banco de dados
- **JWT**: Autenticação baseada em tokens
- **Swagger**: Documentação interativa da API
- **Docker**: Containerização da aplicação

## Funcionalidades

### Produtos

- Criação, listagem, detalhamento, atualização e remoção de produtos
- Controle de estoque

### Pedidos

- Criação de pedidos com verificação de estoque
- Cálculo automático do valor total
- Listagem e detalhamento de pedidos

### Autenticação

- Registro e login de usuários
- Proteção de rotas com JWT
- Validação de credenciais

## Configuração e Execução

### Pré-requisitos

- Docker e Docker Compose instalados

### Executando com Docker

1. Clone o repositório
2. Navegue até a pasta do projeto
3. Execute o comando:

```bash
docker-compose up
```

A aplicação estará disponível em `http://localhost:3000`.

### Executando sem Docker

1. Clone o repositório
2. Navegue até a pasta do projeto
3. Instale as dependências:

```bash
cd api
npm install
```

4. Execute a aplicação:

```bash
npm run start:dev
```

A aplicação estará disponível em `http://localhost:3000`.

## Endpoints da API

A documentação completa da API está disponível através do Swagger em `http://localhost:3000/api` quando a aplicação estiver em execução.

### Produtos

- `POST /produtos`: Criar um novo produto (requer autenticação)
- `GET /produtos`: Listar todos os produtos
- `GET /produtos/:id`: Obter detalhes de um produto específico
- `PUT /produtos/:id`: Atualizar informações de um produto (requer autenticação)
- `DELETE /produtos/:id`: Remover um produto (requer autenticação)

### Pedidos

- `POST /pedidos`: Criar um novo pedido (requer autenticação)
- `GET /pedidos`: Listar todos os pedidos (requer autenticação)
- `GET /pedidos/:id`: Obter detalhes de um pedido específico (requer autenticação)

### Autenticação

- `POST /auth/register`: Registrar um novo usuário
- `POST /auth/login`: Autenticar um usuário e obter token JWT

## Estrutura do Projeto

```
api/
├── src/
│   ├── common/
│   │   └── middleware/
│   │       └── logging/
│   ├── config/
│   ├── modules/
│   │   ├── auth/
│   │   ├── orders/
│   │   └── products/
│   ├── app.module.ts
│   └── main.ts
├── test/
├── Dockerfile
└── package.json
```

## Autenticação

A API utiliza autenticação JWT (JSON Web Token). Para acessar endpoints protegidos:

1. Registre um usuário ou faça login para obter um token
2. Inclua o token no cabeçalho de autorização das requisições:
   ```
   Authorization: Bearer seu_token_aqui
   ```

## Testes

A aplicação inclui testes unitários para a lógica de negócio. Para executar os testes:

```bash
npm run test
```

## Middleware de Logging

A aplicação inclui um middleware de logging que registra informações sobre todas as requisições recebidas, incluindo método, URL, timestamp e tempo de resposta.

## Docker

A aplicação está configurada para ser executada em containers Docker:

- O arquivo `docker-compose.yml` orquestra a subida do serviço da aplicação
- O volume do banco de dados SQLite é persistido para que os dados não sejam perdidos ao derrubar os containers
- A aplicação é exposta na porta 3000

## Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request
