"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getVehicles } from "../../../config/api";
import { io } from "socket.io-client";
import conf from "../../../config/conf";
import useSocket from "../../../hooks/useSocket";
import Footer from "../components/Footer";
import TrafficChart from "../components/TraffigChart";
import TrafficSummary from "../components/TrafficSummary";
import Navbar from "../components/Navbar";
import ReportBytime from "../components/ReportByTime";

const socket = io(conf.apiBaseUrl);

const Dashboard = () => {
  const { vehicles } = useSocket(); // ✅ ใช้ Custom Hook ที่เราสร้างขึ้นมาเพื่อเชื่อมต่อ WebSocket

  const calculateSpeed = (vehicle) => {
    const startTime = new Date(vehicle.entry_time);
    const endTime = new Date(vehicle.exit_time);
    const distance = 200; // ระยะทางเป็นเมตร
    const timeDiff = (endTime - startTime) / 1000; // แปลงจากมิลลิวินาทีเป็นวินาที

    if (timeDiff <= 0) return "เวลาไม่ถูกต้อง";

    const speed_mps = distance / timeDiff; // ความเร็วเป็น m/s
    const speed_kmph = speed_mps * 3.6; // แปลงเป็น km/h

    return {
      speed_kmph: `${speed_kmph.toFixed(2)}`,
    };
  };

  const countVehiclesByType = (vehicleData) => {
    return vehicleData.reduce((acc, { class: type }) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
  };
  const countTodayVehicles = (vehicles) => {
    const today = new Date().toISOString().split("T")[0]; // ได้วันที่วันนี้ในรูปแบบ YYYY-MM-DD
  
    return vehicles.filter((vehicle) => {
      const vehicleDate = new Date(vehicle.entry_time).toISOString().split("T")[0];
      return vehicleDate === today;
    }).length; // คืนค่าจำนวนรถที่ตรวจจับได้
  };
  console.log("🚀 ~ file: page.jsx ~ line 100 ~ Dashboard ~ vehicles", countTodayVehicles(vehicles))

  return (
    <div>
      <div className="bg-rose-200">
        {/* <p>Status: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}</p> */}
        <Navbar />
        <div className="py-12 px-10 md:flex-row bg-white rounded-b-3xl drop-shadow-xl">
          <div className="mt-12 mb-3 flex flex-col w-full">
            <h1 className="text-3xl text-black font-bold">ระบบตรวจจับพาหนะ</h1>
          </div>

          <ReportBytime vehicles={vehicles} />
        </div>

        <div className="flex overflow-hidden bg-gradient-to-b from-rose-200 to-gray-100">
          <div
            id="main-content"
            className="h-full w-full bg-gradient-to-b from-rose-200 to-gray-100 relative overflow-y-auto mx-12"
          >
            <main>
              <div className="flex flex-col pt-6 px-4">
                <div className="flex flex-col md:flex-row pt-6 ">
                  {/* กราฟด้านบน (60%) */}
                  <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 md:w-[75%] w-full">
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
                      <div className="flex-shrink-0">
                        <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
                          {countTodayVehicles(vehicles)}
                        </span>
                        <h3 className="text-base font-normal text-gray-500">
                          จำนวนรถที่ตรวจจับได้ทั้งหมดในวันนี้
                        </h3>
                      </div>
                      <div className="flex items-center justify-end text-green-500 text-base font-bold">
                        12.5%
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </div>
                    </div>
                    <div id="diagram" className="w-full h-auto">
                      <TrafficChart vehicleData={vehicles} />
                    </div>
                  </div>

                  {/* Traffic Summary (40%) */}
                  <div className="md:w-[25%] w-full mt-6 md:mt-0 md:pl-6">
                    <TrafficSummary vehicleData={vehicles} />
                  </div>
                </div>

                {/* ตารางอยู่ด้านล่าง */}
                <div className="bg-white shadow rounded-lg p-4  sm:p-6 xl:p-8 mt-4 w-full">
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
                        href="#"
                        className="text-sm font-medium text-cyan-600 hover:bg-gray-100 rounded-lg p-2"
                      >
                        ดูทั้งหมด
                      </Link>
                    </div>
                  </div>
                  <div className="overflow-x-auto rounded-lg">
                    <div className="align-middle inline-block min-w-full">
                      <div className="shadow overflow-hidden sm:rounded-lg">
                        <div className="overflow-y-auto max-h-[500px]">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                              <tr>
                                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  ID
                                </th>
                                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  ประเภทของรถ
                                </th>
                                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  วันที่
                                </th>
                                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  เวลา
                                </th>
                                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  ความเร็ว
                                </th>
                              </tr>
                            </thead>

                            <tbody className="bg-white">
                              {vehicles
                                .slice() // สร้างสำเนาอาร์เรย์เพื่อป้องกันการเปลี่ยนแปลงค่าเดิม
                                .sort(
                                  (a, b) =>
                                    new Date(b.entry_time) -
                                    new Date(a.entry_time)
                                ) // เรียงลำดับจากใหม่ → เก่า
                                .map((vehicle, index) => {
                                  if (!vehicle.class) return null;

                                  const formattedDate = new Date(
                                    vehicle.entry_time
                                  ).toLocaleDateString("th-TH", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  });

                                  const timeOnly = new Date(
                                    vehicle.entry_time
                                  ).toLocaleTimeString("th-TH", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                  });

                                  return (
                                    <tr
                                      key={vehicle.id}
                                      className={
                                        index % 2 === 1 ? "bg-gray-50" : ""
                                      }
                                    >
                                      <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-500">
                                        {vehicle.yolo_id}
                                      </td>
                                      <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-900">
                                        <span
                                          className={`font-semibold ${
                                            vehicle.class === "car"
                                              ? "text-[#3b8f88]"
                                              : "text-[#b3b44b]"
                                          }`}
                                        >
                                          {vehicle.class === "car"
                                            ? "รถยนต์"
                                            : "รถบรรทุก"}
                                        </span>
                                      </td>

                                      <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-500">
                                        {formattedDate}
                                      </td>
                                      <td className="p-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        {timeOnly}
                                      </td>
                                      <td className="p-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        <span
                                          className={
                                            calculateSpeed(vehicle).speed_kmph >
                                            100
                                              ? "text-red-500"
                                              : ""
                                          }
                                        >
                                          {calculateSpeed(vehicle).speed_kmph
                                            ? `${
                                                calculateSpeed(vehicle)
                                                  .speed_kmph
                                              } km/h`
                                            : "ไม่สามารถคำนวณได้"}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* สรุปข้อมูลรถแยกประเภท */}
              </div>
            </main>
            {/* <Footer /> */}
            <p className="text-center text-sm text-gray-500 my-10">
              &copy; 2025{" "}
              <Link href="#" className="hover:underline">
                CarTally
              </Link>
              . All rights reserved.
            </p>
          </div>
        </div>
        <script async defer src="https://buttons.github.io/buttons.js"></script>
        <script src="https://demo.themesberg.com/windster/app.bundle.js"></script>
      </div>
    </div>
  );
};

export default Dashboard;
