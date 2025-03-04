"use client";
// src/context/context.js
import React, { createContext, useContext, useState, useEffect } from "react";
// import useSocket from "../../hooks/useSocket";
import { io } from "socket.io-client";
import conf from "../../config/conf";
const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [vehicles, setVehicles] = useState([]);
	const [frame, setFrame] = useState(null);
	const [error, setError] = useState(null);
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		const newSocket = io(conf.apiBaseUrl, {
			transports: ["websocket"],
			reconnection: true,
			reconnectionAttempts: Infinity,
			reconnectionDelay: 2000,
		});
		setSocket(newSocket);

		return () => {
			newSocket.disconnect();
		};
	}, []);

	useEffect(() => {
		if (!socket) return;

		const handleVehiclesData = (data) => {
			setVehicles((prev) => (JSON.stringify(prev) !== JSON.stringify(data) ? data : prev));
		};

		const handleFrameData = (data) => {
			const base64String = btoa(
				new Uint8Array(data).reduce((acc, byte) => acc + String.fromCharCode(byte), "")
			);
			setFrame(`data:image/jpeg;base64,${base64String}`);
		};

		const handleConnectError = (err) => {
			console.error("Socket connection error:", err);
			setError("Failed to connect to the server");
			setIsConnected(false);
		};

		const handleReconnect = (attempt) => {
			console.log(`Reconnecting... Attempt ${attempt}`);
		};

		const handleReconnectError = (err) => {
			console.error("Reconnection error:", err);
		};

		const handleDisconnect = () => {
			setIsConnected(false);
		};

		socket.on("connect", () => {
			setIsConnected(true);
			setError(null);
		});
		socket.on("vehicles", handleVehiclesData);
		socket.on("frame", handleFrameData);
		socket.on("connect_error", handleConnectError);
		socket.on("disconnect", handleDisconnect);
		socket.on("reconnect_attempt", handleReconnect);
		socket.on("reconnect_error", handleReconnectError);

		return () => {
			socket.off("vehicles", handleVehiclesData);
			socket.off("frame", handleFrameData);
			socket.off("connect_error", handleConnectError);
			socket.off("disconnect", handleDisconnect);
			socket.off("reconnect_attempt", handleReconnect);
			socket.off("reconnect_error", handleReconnectError);
		};
	}, [socket]);

	return (
		<SocketContext.Provider value={{ socket, vehicles, frame, error, isConnected }}>
			{children}
		</SocketContext.Provider>
	);
};

export const useSocketContext = () => {
	const context = useContext(SocketContext);
	//   console.log("useSocketContext context value:", context);
	if (context === undefined) {
		throw new Error("useSocketContext must be used within a SocketProvider");
	}
	return context;
};
