import { useEffect, useState, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import conf from "../config/conf";

const useSocket = () => {
  const [vehicles, setVehicles] = useState([]);
  const [frame, setFrame] = useState(null);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const maxReconnectAttempts = 5;
  const reconnectAttemptsRef = useRef(0);

  // Memoized event handlers
  const handleVehiclesData = useCallback((data) => {
    console.log("📡 Received vehicles data:", data);
    setVehicles((prev) => {
      // Prevent unnecessary rerenders if data is unchanged
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
  }, []);

  const handleDisconnect = useCallback(() => {
    setIsConnected(false);
    attemptReconnect();
  }, []);

  const attemptReconnect = useCallback(() => {
    if (
      reconnectAttemptsRef.current < maxReconnectAttempts &&
      !socketRef.current?.connected
    ) {
      const delay = Math.min(1000 * 2 ** reconnectAttemptsRef.current, 10000);
      reconnectTimeoutRef.current = setTimeout(() => {
        reconnectAttemptsRef.current += 1;
        console.log(`Reconnection attempt ${reconnectAttemptsRef.current}`);
        socketRef.current?.connect();
      }, delay);
    }
  }, []);

  useEffect(() => {
    // Socket initialization with optimized options
    socketRef.current = io(conf.apiBaseUrl, {
      transports: ["websocket"],
      reconnection: false, // We'll handle reconnection manually
      timeout: 10000,
      forceNew: false,
      autoConnect: true,
    });

    // Event listeners
    const socket = socketRef.current;

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

    // Cleanup function
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socket) {
        socket.off("connect");
        socket.off("vehicles", handleVehiclesData);
        socket.off("frame", handleFrameData);
        socket.off("connect_error", handleConnectError);
        socket.off("disconnect", handleDisconnect);
        socket.disconnect();
      }
    };
  }, [
    handleVehiclesData,
    handleFrameData,
    handleConnectError,
    handleDisconnect,
  ]);

  // Memoized return value to prevent unnecessary rerenders
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
