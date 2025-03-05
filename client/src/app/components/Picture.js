"use client";
import React, { useRef, useEffect } from "react";
import { useSocketContext } from "@/context/context";

function Picture() {
  const { frame, error, isConnected } = useSocketContext();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!frame || !canvasRef.current || !isConnected) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // แปลง byte เป็นภาพโดยตรง
    const renderFrame = async () => {
      try {
        const blob = new Blob([frame], { type: "image/jpeg" });
        const bitmap = await createImageBitmap(blob);

        const maxWidth = 960;
        const maxHeight = 540;
        let width = bitmap.width;
        let height = bitmap.height;
        const aspectRatio = width / height;

        // คำนวณสัดส่วนเพื่อรักษา aspect ratio
        if (width > maxWidth) {
          width = maxWidth;
          height = width / aspectRatio;
        }
        if (height > maxHeight) {
          height = maxHeight;
          width = height * aspectRatio;
        }

        canvas.width = width;
        canvas.height = height;
        context.drawImage(bitmap, 0, 0, width, height);
        console.log(
          "Frame rendered at:",
          new Date().toISOString(),
          "size:",
          `${width}x${height}`
        );

        bitmap.close(); // ล้างทรัพยากร
      } catch (err) {
        console.error("Failed to render frame from byte data:", err);
      }
    };

    renderFrame();
  }, [frame, isConnected]);

  return (
    <div className="flex flex-col w-full container mx-auto p-4 items-center justify-center">
      {error || !isConnected ? (
        <div className="w-full max-w-4xl flex items-center justify-center bg-red-100 border border-red-400 rounded-lg p-4">
          <p className="text-red-700 text-center">
            {error || "Stream disconnected"}
          </p>
        </div>
      ) : (
        <div className="w-full max-w-4xl">
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
