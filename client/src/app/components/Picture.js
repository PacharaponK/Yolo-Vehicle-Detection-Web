"use client";

import { useSocketContext } from "@/context/context";
import React, { useRef, useEffect } from "react";

function Picture() {
  const { frame, error } = useSocketContext();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (frame && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // สร้าง Image object จาก base64 string
      const img = new window.Image();
      img.src = frame;

      img.onload = () => {
        // กำหนดขนาดสูงสุด
        const maxWidth = 960;
        const maxHeight = 540;
        let width = img.width;
        let height = img.height;

        // คำนวณสัดส่วนเพื่อรักษา aspect ratio
        const aspectRatio = width / height;
        if (width > maxWidth) {
          width = maxWidth;
          height = width / aspectRatio;
        }
        if (height > maxHeight) {
          height = maxHeight;
          width = height * aspectRatio;
        }

        // ปรับขนาด canvas
        canvas.width = width;
        canvas.height = height;
        context.drawImage(img, 0, 0, width, height);
      };

      img.onerror = () => {
        console.error("Failed to load image from frame data");
      };
    }
  }, [frame]);

  return (
    <div className="flex flex-col w-full container mx-auto p-4 items-center justify-center">
      {error ? (
        <div className="w-full max-w-4xl flex items-center justify-center bg-red-100 border border-red-400 rounded-lg p-4">
          <p className="text-red-700 text-center">{error}</p>
        </div>
      ) : (
        <div className="w-full max-w-4xl">
          {/* เฟรมปัจจุบัน (ใช้ Canvas) */}
          <div className="w-full">
            {frame ? (
              <canvas
                ref={canvasRef}
                className="border rounded-lg shadow-lg w-full h-auto object-cover max-w-full"
              />
            ) : (
              <div className="w-full aspect-[16/9] flex items-center justify-center bg-gray-200 border rounded-lg shadow-lg">
                <p className="text-gray-700 text-center">Loading stream...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Picture;
