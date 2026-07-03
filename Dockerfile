# RHUFT v6.0 — Development & Runtime Container
FROM node:20-bookworm-slim

# Install security updates and basic tooling
RUN apt-get update && apt-get upgrade -y && apt-get install -y --no-install-recommends \
    git \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy dependency manifests first for layer caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Run as non-root user
USER node

# Default command
CMD ["npm", "run", "dev"]
