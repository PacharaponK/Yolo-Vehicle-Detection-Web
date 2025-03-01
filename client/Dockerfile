# ใช้ Node.js เป็น base image
FROM node:18-alpine AS builder

# ตั้งค่า working directory
WORKDIR /app

# คัดลอก package.json และติดตั้ง dependencies
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# คัดลอกไฟล์โปรเจคทั้งหมด
COPY . .

# สร้าง build สำหรับ production
RUN npm run build

# ใช้ Node.js runtime แยกสำหรับ production
FROM node:18-alpine

WORKDIR /app

# คัดลอกไฟล์จาก builder stage
COPY --from=builder /app ./

# ตั้งค่าพอร์ตที่ expose
EXPOSE 3000

# รัน Next.js ในโหมด production
CMD ["npm", "run", "start"]
