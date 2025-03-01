"use client";
import React, { useState, useEffect } from "react";
import useSocket from "../../../hooks/useSocket";

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
    <div className="flex flex-col w-full container mx-auto p-4 items-center">
      {error ? (
        <div className="w-[640px] h-[480px] flex items-center justify-center bg-red-100 border border-red-400 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          {/* เฟรมล่าสุด (ใหญ่) */}
          <div className="flex-1 max-w-[640px]">
            {frameHistory.length > 0 ? (
              <img
                src={frameHistory[0]}
                width="640"
                height="480"
                alt="Latest Frame"
                className="border rounded-lg shadow-lg w-full h-auto"
              />
            ) : (
              <div className="w-[640px] h-[480px] flex items-center justify-center bg-gray-200 border rounded-lg shadow-lg">
                <p className="text-gray-700">Loading stream...</p>
              </div>
            )}
          </div>

          {/* เฟรมก่อนหน้า (เล็ก) */}
          <div className="flex flex-col gap-4">
            {/* เฟรม -1 */}
            <div className="w-[320px] h-[240px] flex items-center justify-center bg-gray-200 border rounded-lg shadow-md">
              {frameHistory[1] ? (
                <img
                  src={frameHistory[1]}
                  width="320"
                  height="240"
                  alt="Frame -1"
                  className="w-full h-auto"
                />
              ) : (
                <p className="text-gray-700">Loading...</p>
              )}
            </div>
            {/* เฟรม -2 */}
            <div className="w-[320px] h-[240px] flex items-center justify-center bg-gray-200 border rounded-lg shadow-md">
              {frameHistory[2] ? (
                <img
                  src={frameHistory[2]}
                  width="320"
                  height="240"
                  alt="Frame -2"
                  className="w-full h-auto"
                />
              ) : (
                <p className="text-gray-700">Loading...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Picture;
