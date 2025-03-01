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

  const handleVehiclesData = useCallback((data) => {
    console.log("📡 Received vehicles data:", data);
    setVehicles((prev) => {
      if (JSON.stringify(prev) !== JSON.stringify(data)) {
        return data;
      }
      return prev;
    });
  }, []);

  const handleFrameData = useCallback((data) => {
    console.log("📷 Received frame data");
    setFrame((prev) => `data:image/jpeg;base64,${data}`);
  }, []);

  const handleConnectError = useCallback((err) => {
    console.error("Socket connection error:", err);
    setError("Failed to connect to the server");
    setIsConnected(false);
    attemptReconnect();
  }, []);

  const handleDisconnect = useCallback(() => {
    console.log("🔌 Socket disconnected");
    setIsConnected(false);
    attemptReconnect();
  }, []);

  const attemptReconnect = useCallback(() => {
    if (
      reconnectAttemptsRef.current < maxReconnectAttempts &&
      !socket.connected
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

  const connectSocket = useCallback(() => {
    if (!socket.connected && !socket.connecting) {
      socket.connect();
    }
  }, []);

  useEffect(() => {
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

    // เชื่อมต่อครั้งแรก
    connectSocket();

    // Cleanup
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      // ลบเฉพาะ event listeners ไม่ disconnect socket
      socket.off("connect");
      socket.off("vehicles", handleVehiclesData);
      socket.off("frame", handleFrameData);
      socket.off("connect_error", handleConnectError);
      socket.off("disconnect", handleDisconnect);
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
