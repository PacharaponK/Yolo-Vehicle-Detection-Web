import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import db2 from "./db2";
import { VehiclesSocket } from "../sockets/VehiclesSocket";

dotenv.config();
const FRONT_PORT = process.env.FRONT_PORT || "8000";
const FRONT_URL = process.env.FRONT_URL || "localhost";

export const setupSocket = (server: http.Server) => {
	const io = new Server(server, {
		cors: {
			origin: `*`,
			methods: ["GET", "POST"],
		},
	});
	// WebSocket: ส่งข้อมูล vehicles
	io.on("connection", async (socket) => {
		console.log("✅ Connected to WebSocket Server", socket.id);

		VehiclesSocket(io, socket); // ดึงข้อมูลเมื่อ Client เชื่อมต่อ
		socket.on("frame", (data) => {
			io.emit("frame", data); // Broadcast frame to all clients
		});
		socket.on("disconnect", () => {
			console.log("❌ Disconnected from WebSocket Server");
		});
	});

	return io;
};
