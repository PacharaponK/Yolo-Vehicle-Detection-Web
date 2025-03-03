"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ax from "../../../config/ax";
import moment from "moment";
import Link from "next/link";
import VideoDetail from "../components/VideoDetail"; // นำเข้า VideoDetail component

function VehicleHistory() {
  const [videos, setVideos] = useState([]);
  // console.log("🚀 ~ VehicleHistory ~ videos:", videos)
  const [selectedVideo, setSelectedVideo] = useState(null); // State สำหรับเก็บวิดีโอที่เลือก
  const [isModalOpen, setIsModalOpen] = useState(false); // State สำหรับควบคุม Modal

  // ฟังก์ชันดึงข้อมูลจาก API
  const fetchData = async () => {
    try {
      const res = await ax.get("/api/video/all");
      // console.log("API Response:", res.data.data);
      setVideos(res.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setVideos([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ฟังก์ชันเปิด Modal
  const openModal = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  // ฟังก์ชันปิด Modal
  const closeModal = () => {
    setSelectedVideo(null);
    setIsModalOpen(false);
  };

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
                    <tr
                      key={video.id}
                      className="border-b hover:bg-gray-100 cursor-pointer"
                      onClick={() => openModal(video)} // คลิกเพื่อเปิด Modal
                    >
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={closeModal}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4 text-slate-400">รายละเอียดวิดีโอ</h2>
            <VideoDetail video={selectedVideo} />
          </div>
        </div>
      )}
    </div>
  );
}

export default VehicleHistory;
