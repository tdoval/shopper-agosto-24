FROM node:20-alpine AS base

WORKDIR /app

COPY . .

RUN apk --no-cache add curl

RUN npm install  && \
  npx prisma generate && \ 
  npm run seed

EXPOSE 3000

CMD ["npm", "run", "dev"]
