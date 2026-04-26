# ─────────────────────────────────────────────────────────────
# Stage 1: Build the React app
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first (layer caching — faster rebuilds)
COPY package.json package-lock.json ./

# Install all dependencies
RUN npm ci --frozen-lockfile

# Copy source code
COPY . .

# Build production bundle
# VITE_ env vars baked in at build time
RUN npm run build

# ─────────────────────────────────────────────────────────────
# Stage 2: Serve with nginx
# ─────────────────────────────────────────────────────────────
FROM nginx:alpine

# Copy built app from Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Cloud Run requires container to listen on 8080
EXPOSE 8080

# nginx runs in foreground (required for Docker)
CMD ["nginx", "-g", "daemon off;"]
