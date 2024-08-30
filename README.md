# Sistema de Medições

Este é um sistema para gerenciamento de medições, permitindo upload de imagens de medidores, correção de leituras e listagem de medições realizadas.

## Tecnologias Utilizadas

- **Next.js**: Framework React para aplicações web.
- **Prisma**: ORM utilizado para interagir com o banco de dados PostgreSQL.
- **PostgreSQL**: Banco de dados relacional.
- **Tailwind CSS**: Framework CSS para estilização.
- **ShadcnUI**: Biblioteca de componentes UI.
- **Bun**: Gerenciador de pacotes e runtime para executar o projeto.
- **Docker**: Para criação e gerenciamento de contêineres.

## Requisitos

- **Docker** (v20.10 ou superior)
- **Docker Compose** (v1.27 ou superior)

## Instalação

### 1. Clone o Repositório

```bash
git clone https://github.com/tdoval/shopper-agosto-24.git
cd shopper-agosto-24
```

### 2. Configure as variáveis de ambiente

- Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente:

```bash
DATABASE_URL="postgresql://usuario:senha@server/db"
GEMINI_API_KEY="sua_chave_de_api"
```

### 3. Configuração usando Docker

Contêineres da aplicação e do banco de dados

```bash
docker-compose up -d
```

### 4. Acessar o Projeto

Após executar os comandos acima, o projeto estará disponível em **http://localhost:3000.**

## Funcionalidades

### Upload de Imagem e Processamento LLM

Permite o upload de uma imagem do medidor e processamento automático da leitura.

### Correção de Medições

Corrija ou confirme as leituras feitas pelo sistema

### Listar Medições

Visualize todas as medições realizadas, filtrando por cliente ou tipo de medição.
