import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import conf from "../config/conf";

const useSocket = () => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const socket = io(conf.apiBaseUrl, { transports: ["websocket"] });

    socket.on("vehicles", (data) => {
      console.log("📡 Received vehicles data:", data);
      setVehicles(data); // ✅ อัปเดตข้อมูลอัตโนมัติ
    });

    return () => {
      socket.disconnect(); // ✅ ปิด WebSocket เมื่อ component ถูก unmount
    };
  }, []);

  return { vehicles };
};

export default useSocket;
