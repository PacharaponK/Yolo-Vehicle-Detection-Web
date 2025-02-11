"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_js_1 = __importDefault(require("./config/db.js"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3001;
const URL = process.env.URL || "localhost";
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:8000", // ✅ ให้ Frontend ที่รันที่ localhost:8000 เชื่อมต่อได้
        methods: ["GET", "POST"],
    },
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// WebSocket: ส่งข้อมูล vehicles
io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("✅ Connected to WebSocket Server", socket.id);
    const fetchVehicles = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const [rows] = yield db_js_1.default.execute("SELECT * FROM vehicle_data");
            console.log("🚀 Sending vehicles data:", rows); // ✅ ตรวจสอบว่าข้อมูลถูกดึงมาแล้ว
            socket.emit("vehicles", rows); // ✅ ส่งข้อมูลไปยัง client
        }
        catch (error) {
            console.error("🚨 Error fetching vehicles:", error);
        }
    });
    fetchVehicles(); // ดึงข้อมูลเมื่อ Client เชื่อมต่อ
    socket.on("disconnect", () => {
        console.log("❌ Disconnected from WebSocket Server");
    });
}));
// เชื่อมต่อ MySQL
try {
    db_js_1.default.getConnection();
    console.log("[server] Connected to MySQL");
}
catch (err) {
    console.log("[server] MySQL connection error\n", err);
}
const testDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_js_1.default.execute("SELECT * FROM vehicle_data");
        console.log("✅ Database Test: ", rows); // ✅ ตรวจสอบข้อมูล
    }
    catch (error) {
        console.error("🚨 Database Error:", error);
    }
});
testDB();
// Start Server
server.listen(PORT, () => {
    console.log(`[server] Server is running on http://${URL}:${PORT}`);
});
