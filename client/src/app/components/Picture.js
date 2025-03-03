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

      // วาดภาพเมื่อโหลดเสร็จ
      img.onload = () => {
        // ปรับขนาด canvas ให้ตรงกับภาพ (หรือกำหนดขนาดตายตัว)
        canvas.width = img.width; // หรือกำหนด 960
        canvas.height = img.height; // หรือกำหนด 540
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      };

      // จัดการ error ถ้าภาพโหลดไม่สำเร็จ
      img.onerror = () => {
        console.error("Failed to load image from frame data");
      };
    }
  }, [frame]);

  return (
    <div className="flex flex-col w-full min-h-[70vh] container mx-auto p-4 items-center justify-center">
      {error ? (
        <div className="w-full h-full flex items-center justify-center bg-red-100 border border-red-400 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center w-full h-full">
          {/* เฟรมปัจจุบัน (ใช้ Canvas) */}
          <div className="flex-1 w-full h-full max-w-[960px]">
            {frame ? (
              <canvas
                ref={canvasRef}
                className="border rounded-lg shadow-lg w-full h-auto object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 border rounded-lg shadow-lg">
                <p className="text-gray-700">Loading stream...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Picture;
