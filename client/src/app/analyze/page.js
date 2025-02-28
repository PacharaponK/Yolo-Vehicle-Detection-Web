"use client";
import React from "react";
import Navbar from "../components/Navbar";
import TrafficChart from "../components/TraffigChart";
import { io } from "socket.io-client";
import useSocket from "../../../hooks/useSocket";
import conf from "../../../config/conf";

const socket = io(conf.apiBaseUrl);

function Analye() {
  const { vehicles } = useSocket();
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-rose-200 to-gray-100">
      <Navbar />
      <div className="mt-16 overflow-hidden h-full w-[90%] mx-auto">
        <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 mt-4 w-full">
          <TrafficChart vehicleData={vehicles} />
        </div>
      </div>
    </div>
  );
}

export default Analye;
