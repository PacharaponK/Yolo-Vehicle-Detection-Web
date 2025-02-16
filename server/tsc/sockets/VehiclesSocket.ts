import { Server, Socket } from "socket.io";
import db2 from "../config/db2";
export const VehiclesSocket = async (io?: Server, socket?: Socket) => {
	try {
		const vehicle = await db2.vehicle_data.findMany();
		// console.log("🚀 Sending vehicles data:", rows); // ✅ ตรวจสอบว่าข้อมูลถูกดึงมาแล้ว
		if (socket) {
			socket.emit("vehicles", vehicle); // ✅ ส่งข้อมูลไปยัง client
		} else {
			if (io) {
				io.emit("vehicles", vehicle);
			}
		}
	} catch (error) {
		console.error("🚨 Error fetching vehicles:", error);
	}
};
