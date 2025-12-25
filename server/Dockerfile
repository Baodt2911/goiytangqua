# ===== BUILD STAGE =====
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ===== RUN STAGE =====
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
CMD ["node", "dist/server.js"]
