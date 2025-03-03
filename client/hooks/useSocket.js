import { useEffect, useState, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import conf from "../config/conf";

// สร้าง socket instance นอก component และเก็บเป็น singleton
const socket = io(conf.apiBaseUrl, {
  transports: ["websocket"],
  reconnection: false, // ปิด reconnection อัตโนมัติของ socket.io
  timeout: 10000,
  forceNew: false,
  autoConnect: false, // ปิด autoConnect เพื่อควบคุมเอง
});

const useSocket = () => {
  const [vehicles, setVehicles] = useState([]);
  const [frame, setFrame] = useState(null);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(socket.connected);

  const reconnectTimeoutRef = useRef(null);
  const maxReconnectAttempts = 5;
  const reconnectAttemptsRef = useRef(0);
  const isMountedRef = useRef(false); // ใช้ตรวจสอบว่า component ยัง mount อยู่

  // Handler สำหรับข้อมูล vehicles
  const handleVehiclesData = useCallback((data) => {
    console.log("📡 Received vehicles data:", data);
    setVehicles((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(data)) {
        return data;
      }
      return prev;
    });
  }, []);

  // Handler สำหรับข้อมูล frame
  const handleFrameData = useCallback((data) => {
    console.log("📷 Received frame data");
    setFrame(`data:image/jpeg;base64,${data}`);
  }, []);

  // Handler เมื่อเกิด connection error
  const handleConnectError = useCallback((err) => {
    console.error("Socket connection error:", err);
    setError("Failed to connect to the server");
    setIsConnected(false);
    attemptReconnect();
  }, []);

  // Handler เมื่อ disconnect
  const handleDisconnect = useCallback(() => {
    console.log("🔌 Socket disconnected");
    setIsConnected(false);
    attemptReconnect();
  }, []);

  // ฟังก์ชัน reconnect
  const attemptReconnect = useCallback(() => {
    if (
      reconnectAttemptsRef.current < maxReconnectAttempts &&
      !socket.connected &&
      isMountedRef.current // reconnect เฉพาะเมื่อ component ยัง mount
    ) {
      const delay = Math.min(1000 * 2 ** reconnectAttemptsRef.current, 10000);
      reconnectTimeoutRef.current = setTimeout(() => {
        reconnectAttemptsRef.current += 1;
        console.log(`Reconnection attempt ${reconnectAttemptsRef.current}`);
        socket.connect();
      }, delay);
    } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      setError("Max reconnection attempts reached");
    }
  }, []);

  // ฟังก์ชันเชื่อมต่อ socket
  const connectSocket = useCallback(() => {
    if (!socket.connected && !socket.connecting) {
      console.log("Attempting to connect socket...");
      socket.connect();
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true; // ระบุว่า component mount แล้ว

    // ถ้า socket ยังไม่เชื่อมต่อ ให้ลองเชื่อมต่อ
    if (!socket.connected) {
      connectSocket();
    }

    // ตั้งค่า event listeners
    socket.on("connect", () => {
      setIsConnected(true);
      setError(null);
      reconnectAttemptsRef.current = 0;
      console.log("✅ Socket connected");
    });

    socket.on("vehicles", handleVehiclesData);
    socket.on("frame", handleFrameData);
    socket.on("connect_error", handleConnectError);
    socket.on("disconnect", handleDisconnect);

    // Cleanup เมื่อ component unmount
    return () => {
      isMountedRef.current = false; // ระบุว่า component unmount
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      // ไม่ต้องลบ event listeners หรือ disconnect socket
      // เพื่อให้ socket ทำงานต่อเนื่องแม้เปลี่ยนหน้า
    };
  }, [
    handleVehiclesData,
    handleFrameData,
    handleConnectError,
    handleDisconnect,
    connectSocket,
  ]);

  return {
    vehicles,
    frame,
    error,
    isConnected,
    reconnect: () => {
      reconnectAttemptsRef.current = 0;
      attemptReconnect();
    },
  };
};

export default useSocket;
