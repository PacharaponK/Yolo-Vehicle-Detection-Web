# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# คัดลอก package.json และติดตั้ง dependencies
COPY package*.json ./
RUN npm install --omit=dev

# คัดลอกโค้ดทั้งหมดและ build
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app

# คัดลอกไฟล์ที่จำเป็นสำหรับ production
COPY package*.json ./  
RUN npm install --omit=dev  

COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules 

CMD ["npm", "start"]
