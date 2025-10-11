# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build React/Vite app
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine

WORKDIR /app

# Copy built files
COPY --from=build /app/dist ./dist

# Install serve globally
RUN npm install -g serve

# Expose the port Cloud Run uses
EXPOSE 8080

# Start server on the port Cloud Run sets
CMD ["serve", "-s", "dist", "-l", "8080"]