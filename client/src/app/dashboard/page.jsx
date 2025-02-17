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

const socket = io(conf.apiBaseUrl);

const Dashboard = () => {
  const { vehicles } = useSocket(); // ✅ ใช้ Custom Hook ที่เราสร้างขึ้นมาเพื่อเชื่อมต่อ WebSocket

  const calculateSpeed = (vehicle) => {
    const startTime = new Date(vehicle.entry_time);
    const endTime = new Date(vehicle.exit_time);
    const distance = 300; // ระยะทางเป็นเมตร
    const timeDiff = (endTime - startTime) / 1000; // แปลงจากมิลลิวินาทีเป็นวินาที

    if (timeDiff <= 0) return "เวลาไม่ถูกต้อง";

    const speed_mps = distance / timeDiff; // ความเร็วเป็น m/s
    const speed_kmph = speed_mps * 3.6; // แปลงเป็น km/h

    return {
      speed_kmph: `${speed_kmph.toFixed(2)} km/h`,
    };
  };

  const countVehiclesByType = (vehicleData) => {
    return vehicleData.reduce((acc, { class: type }) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
  };

  return (
    <div>
      <div>
        {/* <p>Status: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}</p> */}
        <nav className="bg-white border-b border-gray-200 fixed z-30 w-full">
          <div className="px-3 py-3 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-start">
                <button
                  id="toggleSidebarMobile"
                  aria-expanded="true"
                  aria-controls="sidebar"
                  className="lg:hidden mr-2 text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 rounded"
                >
                  <svg
                    id="toggleSidebarMobileHamburger"
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <svg
                    id="toggleSidebarMobileClose"
                    className="w-6 h-6 hidden"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>

                <Link href="/">
                  <h2 className="font-bold text-3xl">
                    CAR{" "}
                    <span className="bg-[#FF8295] text-white px-2 rounded-md">
                      TALLY
                    </span>
                  </h2>
                </Link>
              </div>
              <div className="flex items-center">
                <div className="hidden lg:flex items-center"></div>
                <Link
                  href="#"
                  className="hidden sm:inline-flex ml-5 text-white bg-[#FF8295] hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center items-center mr-3"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <div className="flex overflow-hidden bg-white pt-16">
          <aside
            id="sidebar"
            className="fixed hidden z-20 h-full top-0 left-0 pt-16 flex lg:flex flex-shrink-0 flex-col w-64 transition-width duration-75"
            aria-label="Sidebar"
          >
            <div className="relative flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white pt-0">
              <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <div className="flex-1 px-3 bg-white divide-y space-y-1">
                  <div className="space-y-2 pt-2"></div>
                </div>
              </div>
            </div>
          </aside>
          <div
            className="bg-gray-900 opacity-50 hidden fixed inset-0 z-10"
            id="sidebarBackdrop"
          ></div>
          <div
            id="main-content"
            className="h-full w-full bg-gray-50 relative overflow-y-auto lg:ml-64"
          >
            <main>
              <div className="flex flex-col pt-6 px-4">
                {/* กราฟด้านบน */}
                <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 w-full">
                  <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
                    <div className="flex-shrink-0">
                      <span className="text-2xl sm:text-3xl leading-none font-bold text-gray-900">
                        150
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

                {/* ตารางอยู่ด้านล่าง */}
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
                            <thead className="bg-gray-50">
                              <tr>
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
                              {vehicles.map((vehicle, index) => {
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
                                    <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-900">
                                      <span className="font-semibold">
                                        {vehicle.class}
                                      </span>
                                    </td>
                                    <td className="p-4 whitespace-nowrap text-sm font-normal text-gray-500">
                                      {formattedDate}
                                    </td>
                                    <td className="p-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                      {timeOnly}
                                    </td>
                                    <td className="p-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                      {calculateSpeed(vehicle).speed_kmph}
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
                <div className="mt-4 w-full">
                  <TrafficSummary vehicleData={vehicles} />
                </div>
              </div>
            </main>
            <Footer />
            <p className="text-center text-sm text-gray-500 my-10">
              &copy; 2019-2021{" "}
              <Link href="#" className="hover:underline">
                Themesberg
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
