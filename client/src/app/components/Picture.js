"use client";
import React, { useState, useEffect } from "react";
import useSocket from "../../../hooks/useSocket";
import Image from "next/image"; // เพิ่มการ import Image

function Picture() {
  const { frame, error } = useSocket();
  const [frameHistory, setFrameHistory] = useState([]);

  useEffect(() => {
    if (frame) {
      setFrameHistory((prev) => {
        const newHistory = [frame, ...prev].slice(0, 3); // เก็บ 3 เฟรมล่าสุด
        return newHistory;
      });
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
          {/* เฟรมล่าสุด (ใหญ่) */}
          <div className="flex-1 w-full h-full max-w-[960px]">
            {frameHistory.length > 0 ? (
              <Image
                src={frameHistory[0]}
                width={960}
                height={540}
                alt="Latest Frame"
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
