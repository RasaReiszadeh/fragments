# Dockerfile for Lab 5

# Use specific Node version
FROM node:24.11.0

# Metadata
LABEL maintainer="Rasa Reiszadeh <rreiszadeh@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# Environment defaults
ENV PORT=8080
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

# Create app directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY ./src ./src

# Copy htpasswd (needed for basic auth)
COPY ./tests/.htpasswd ./tests/.htpasswd

# Document exposed port
EXPOSE 8080

# Start server
CMD ["npm", "start"]
