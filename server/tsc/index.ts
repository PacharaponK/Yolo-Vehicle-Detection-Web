import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db";

dotenv.config();
const PORT = process.env.PORT || 3001;
const URL = process.env.URL || "localhost";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
	cors: {
	  origin: "http://localhost:8000", // ✅ ให้ Frontend ที่รันที่ localhost:8000 เชื่อมต่อได้
	  methods: ["GET", "POST"],
	},
  });
  

app.use(cors());
app.use(express.json());

// WebSocket: ส่งข้อมูล vehicles
io.on("connection", async (socket) => {
  console.log("✅ Connected to WebSocket Server", socket.id);

  const fetchVehicles = async () => {
    try {
      const [rows] = await db.execute("SELECT * FROM vehicle_data");
      console.log("🚀 Sending vehicles data:", rows); // ✅ ตรวจสอบว่าข้อมูลถูกดึงมาแล้ว
      socket.emit("vehicles", rows); // ✅ ส่งข้อมูลไปยัง client
    } catch (error) {
      console.error("🚨 Error fetching vehicles:", error);
    }
  };

  fetchVehicles(); // ดึงข้อมูลเมื่อ Client เชื่อมต่อ

  socket.on("disconnect", () => {
    console.log("❌ Disconnected from WebSocket Server");
  });
});

// เชื่อมต่อ MySQL
try {
  db.getConnection();
  console.log("[server] Connected to MySQL");
} catch (err) {
  console.log("[server] MySQL connection error\n", err);
}


const testDB = async () => {
  try {
    const [rows] = await db.execute("SELECT * FROM vehicle_data");
    console.log("✅ Database Test: ", rows); // ✅ ตรวจสอบข้อมูล
  } catch (error) {
    console.error("🚨 Database Error:", error);
  }
};

testDB();


// Start Server
server.listen(PORT, () => {
  console.log(`[server] Server is running on http://${URL}:${PORT}`);
});
