FROM oven/bun:1 AS base

WORKDIR /usr/src/app

COPY . .

RUN bun install --frozen-lockfile

RUN bun prisma generate

EXPOSE 3000/tcp

CMD ["bun", "run", "dev"]
