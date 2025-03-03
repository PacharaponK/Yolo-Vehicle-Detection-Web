"use client"
// src/context/context.js
import React, { createContext, useContext } from "react";
import useSocket from "../../hooks/useSocket";


const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socketData = useSocket();
//   console.log("SocketProvider providing:", socketData);
  return (
    <SocketContext.Provider value={socketData}>
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
