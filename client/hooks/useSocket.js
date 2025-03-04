// src/hooks/useSocket.js
import { useEffect, useState, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import conf from "../config/conf";

// สร้าง socket instance แค่ครั้งเดียว
const socket = io(conf.apiBaseUrl, {
	transports: ["websocket"], // ใช้ WebSocket เท่านั้น
	reconnection: false, // ปิด reconnection อัตโนมัติ
	timeout: 10000,
	forceNew: false,
	autoConnect: false,
});

const useSocket = () => {
	const [vehicles, setVehicles] = useState([]);
	const [frame, setFrame] = useState(null);
	const [error, setError] = useState(null);
	const [isConnected, setIsConnected] = useState(socket.connected);

	const reconnectTimeoutRef = useRef(null);
	const maxReconnectAttempts = 5;
	const reconnectAttemptsRef = useRef(0);
	const isMountedRef = useRef(false);

	const handleVehiclesData = useCallback((data) => {
		//("📡 Received vehicles data:", data);
		setVehicles((prev) => {
			if (JSON.stringify(prev) !== JSON.stringify(data)) {
				return data;
			}
			return prev;
		});
	}, []);

	const handleFrameData = useCallback((data) => {
		//("📷 Received frame data, length:", data.length);
		// แปลง binary data เป็น base64 string
		const base64String = btoa(
			new Uint8Array(data).reduce((acc, byte) => acc + String.fromCharCode(byte), "")
		);
		setFrame(`data:image/jpeg;base64,${base64String}`);
	}, []);

	const handleConnectError = useCallback((err) => {
		console.error("Socket connection error:", err);
		setError("Failed to connect to the server");
		setIsConnected(false);
		attemptReconnect();
	}, []);

	const handleDisconnect = useCallback(() => {
		//("🔌 Socket disconnected");
		setIsConnected(false);
		attemptReconnect();
	}, []);

	const attemptReconnect = useCallback(() => {
		if (
			reconnectAttemptsRef.current < maxReconnectAttempts &&
			!socket.connected &&
			isMountedRef.current
		) {
			const delay = Math.min(1000 * 2 ** reconnectAttemptsRef.current, 10000);
			reconnectTimeoutRef.current = setTimeout(() => {
				reconnectAttemptsRef.current += 1;
				//(`Reconnection attempt ${reconnectAttemptsRef.current}`);
				socket.connect();
			}, delay);
		} else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
			setError("Max reconnection attempts reached");
			//("Max reconnection attempts reached, stopping...");
		}
	}, []);

	const connectSocket = useCallback(() => {
		if (!socket.connected && !socket.connecting) {
			//("Attempting to connect socket...");
			socket.connect();
		} else if (socket.connected) {
			//("Socket already connected, skipping...");
		}
	}, []);

	useEffect(() => {
		isMountedRef.current = true;
		connectSocket(); // เชื่อมต่อครั้งแรก

		socket.on("connect", () => {
			setIsConnected(true);
			setError(null);
			reconnectAttemptsRef.current = 0;
			//("✅ Socket connected, SID:", socket.id);
		});

		socket.on("vehicles", handleVehiclesData);
		socket.on("frame", handleFrameData);
		socket.on("connect_error", handleConnectError);
		socket.on("disconnect", handleDisconnect);

		return () => {
			isMountedRef.current = false;
			if (reconnectTimeoutRef.current) {
				clearTimeout(reconnectTimeoutRef.current);
			}
			// ไม่ disconnect socket เพื่อให้ใช้งานต่อเนื่อง
		};
	}, [handleVehiclesData, handleFrameData, handleConnectError, handleDisconnect, connectSocket]);

	const socketData = {
		vehicles,
		frame,
		error,
		isConnected,
		reconnect: () => {
			reconnectAttemptsRef.current = 0;
			attemptReconnect();
		},
	};
	//("useSocket returning:", socketData);
	return socketData;
};

// export default useSocket;
