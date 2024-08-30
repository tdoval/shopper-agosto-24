# Usa a imagem oficial do Bun
FROM oven/bun:1 AS base

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Instala dependências em um diretório temporário para cache
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Instala com --production (exclui devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Copia node_modules do diretório temporário e os arquivos do projeto
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Copia dependências de produção e código fonte para a imagem final
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app .

RUN bun prisma generate


# Exponha a porta da aplicação
EXPOSE 3000/tcp

# Comando para rodar a aplicação
CMD ["bun", "index.ts"]
