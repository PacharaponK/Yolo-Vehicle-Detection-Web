import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db";
import vehicleRoutes from "./router/vehicleRoutes";
import testRoutes from "./router/testRoutes";
import errorHandler from "./middlewares/errorHandler";
import db2 from "./config/db2";

dotenv.config();
const PORT = process.env.PORT || 3001;
const URL = process.env.URL || "localhost";
const FRONT_URL = process.env.FRONT_URL || "localhost";
const FRONT_PORT = process.env.FRONT_PORT || "8000";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: `http://${FRONT_URL}:${FRONT_PORT}`,
		methods: ["GET", "POST"],
	},
});
app.use(cors());
app.use(express.json());

app.use(testRoutes);
app.use(vehicleRoutes);

// WebSocket: ส่งข้อมูล vehicles
io.on("connection", async (socket) => {
	console.log("✅ Connected to WebSocket Server", socket.id);

	const fetchVehicles = async () => {
		try {
			const [rows] = await db.execute("SELECT * FROM vehicle_data");
			// console.log("🚀 Sending vehicles data:", rows); // ✅ ตรวจสอบว่าข้อมูลถูกดึงมาแล้ว
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

app.use(errorHandler);

(async () => {
	try {
		await db2.$connect();
		console.log("[server] Connected to MySQL with Prisma");
	} catch (error) {
		console.error("[server] MySQL connection error with Prisma\n", error);
	}
})();

// Start Server
server.listen(PORT, () => {
	console.log(`[server] Server is running on http://${URL}:${PORT}`);
});
