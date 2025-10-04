FROM node:20-alpine

WORKDIR /usr/src/app

# Instala dependencias del SO necesarias para node-gyp (si las necesitas)
RUN apk add --no-cache python3 make g++ bash

COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY src ./src

EXPOSE 3000

# Hot reload con Nest (start:dev)
CMD ["npm", "run", "start:dev"]
