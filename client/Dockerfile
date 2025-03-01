FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci  # ติดตั้ง dependencies
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json

# ติดตั้ง dependencies เฉพาะ production
RUN npm install --omit=dev

EXPOSE 3000
CMD ["npm", "run", "start"]
