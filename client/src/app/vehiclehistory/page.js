"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ax from "../../../config/ax";
import moment from "moment";
import Link from "next/link";

function VehicleHistory() {
  const [videos, setVideos] = useState([]);

  // ฟังก์ชันดึงข้อมูลจาก API
  const fetchData = async () => {
    try {
      const res = await ax.get("/api/video/all");
      console.log("API Response:", res.data.data); // ตรวจสอบข้อมูลจาก API
      setVideos(res.data.data); // แก้ไข setVideo เป็น setVideos
    } catch (error) {
      console.error("Error fetching data:", error);
      setVideos([]); // กรณีเกิดข้อผิดพลาด ให้เซ็ตค่าเป็นอาร์เรย์ว่าง
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-rose-200 to-gray-100">
      <Navbar />
      <div className="mt-16 overflow-hidden h-full w-[90%] mx-auto">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 mt-4 w-full">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                รถที่ตรวจจับได้ล่าสุด
              </h3>
              <span className="text-base font-normal text-gray-500">
                รายการแสดงรถที่ตรวจจับเรียงตามลำดับเวลา
              </span>
            </div>
            <div className="flex-shrink-0">
              <Link
                href="vehiclehistory"
                className="text-sm font-medium text-cyan-600 hover:bg-gray-100 rounded-lg p-2"
              >
                ดูทั้งหมด
              </Link>
            </div>
          </div>

          {/* กำหนด max-height และ overflow-y-auto เพื่อให้มี Scrollbar เมื่อข้อมูลล้น */}
          <div className="overflow-y-auto max-h-[650px] border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>

                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ชื่อวิดีโอ
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    วันที่
                  </th>
                  <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    เวลา
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {videos.length > 0 ? (
                  videos.map((video) => (
                    <tr key={video.id} className="border-b hover:bg-gray-100">
                      <td className="p-4 text-sm text-gray-900">{video.id}</td>

                      <td className="p-4 text-sm text-gray-900">
                        {video.title}
                      </td>
                      <td className="p-4 text-sm text-gray-900">
                        {moment(video.createdAt).format("YYYY-MM-DD")}
                      </td>
                      <td className="p-4 text-sm text-gray-900">
                        {moment(video.createdAt).format("HH:mm:ss")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
                      ไม่มีข้อมูลวิดีโอ
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleHistory;
