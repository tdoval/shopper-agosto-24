# Usa uma imagem base do Node.js
FROM node:20-alpine AS base

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia apenas os arquivos de configuração do Node.js e do Prisma
COPY package*.json ./
COPY prisma ./prisma/

# Instala as dependências do projeto
RUN npm install

# Copia o restante do código do projeto
COPY . .

# Gera o cliente Prisma
RUN npx prisma generate

# Define a variável de ambiente DATABASE_URL antes de rodar o seed
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Exponha a porta que a aplicação vai rodar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "dev"]
