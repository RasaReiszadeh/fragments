# Step 20 Optimizing based on lecture
# Rasa Reiszadeh

# -------- Stage 1: Install Dependencies --------
FROM node:18-alpine AS deps

LABEL maintainer="Rasa Reiszadeh <rreiszadeh@myseneca.ca>"
LABEL description="Fragments node.js microservice - optimized multistage build"

WORKDIR /app

# Copy package files first (better layer caching)
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev


# -------- Stage 2: Runtime --------
FROM node:18-alpine

WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY ./src ./src

# Copy htpasswd file for basic auth (used in development mode)
COPY ./tests/.htpasswd ./tests/.htpasswd

# Environment defaults
ENV PORT=8080

EXPOSE 8080

# Start server
CMD ["node", "src/index.js"]


#In Step 20, I optimized my Dockerfile using a multistage build as shown in lecture.
#I separated dependency installation from the runtime image to reduce image size.
#I used node:18-alpine instead of the full Node image to make the container smaller.
#I copied package*.json first to improve Docker layer caching.
#I used npm ci --omit=dev to install only production dependencies.
#This makes the image smaller and more efficient for production use.