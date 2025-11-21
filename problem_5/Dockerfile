# Build stage
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# copy package manifests first for caching
COPY package.json ./
# optional package-lock if present
COPY package-lock.json* ./

# install deps (dev deps needed for tsc)
RUN npm install

# copy source and build
COPY . .

# Ensure TypeScript compiler uses server-only tsconfig
RUN npx tsc -p tsconfig.server.json

# Production stage
FROM node:18-alpine
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Copy built artifacts and production node_modules from builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json

EXPOSE 8080

# default command
CMD ["node", "dist/index.js"]
