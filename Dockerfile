FROM node:18-alpine AS deps

LABEL maintainer="Rasa Reiszadeh <rreiszadeh@myseneca.ca>"
LABEL description="Fragments node.js microservice - optimized multistage build"

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

FROM node:18-alpine

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY ./src ./src
COPY ./tests/.htpasswd ./tests/.htpasswd

ENV PORT=80

EXPOSE 80

CMD ["node", "src/index.js"]