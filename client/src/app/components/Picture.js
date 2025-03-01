"use client";
import React, { useEffect, useRef } from "react";
import io from "socket.io-client";
import conf from "../../../config/conf";

function Picture() {
  const imgRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    socketRef.current = io(conf.apiBaseUrl);

    // Set up socket event listener
    socketRef.current.on("frame", (data) => {
      if (imgRef.current) {
        imgRef.current.src = `data:image/jpeg;base64,${data}`;
      }
    });

    // Cleanup on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Webcam Stream</h1>
      <img
        ref={imgRef}
        id="video-stream"
        width="640"
        height="480"
        alt="Video Stream"
        className="border rounded-lg shadow-lg"
      />
    </div>
  );
}

export default Picture;
