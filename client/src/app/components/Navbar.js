"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ax from "../../../config/ax";

const Navbar = () => {
  const router = useRouter();
  const [jwt, setJwt] = useState(null);

  useEffect(() => {
    // ดึง JWT จาก sessionStorage
    const token = sessionStorage.getItem("jwt");
    setJwt(token);
  }, []);

  const handleLogout = () => {
    // ลบ JWT ออกจาก sessionStorage
    sessionStorage.removeItem("jwt");

    // ลบ JWT ออกจาก cookie
    document.cookie =
      "jwt=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Strict; Secure";

    // ล้าง header Authorization ใน axios instance (ถ้าใช้)
    delete ax.defaults.headers.common["Authorization"];

    // อัปเดต state (ถ้ามี)
    setJwt(null);

    // เปลี่ยนเส้นทางไปหน้า Login
    router.push("/");
  };
  return (
    <header className="fixed inset-x-0 top-0 z-30 mx-auto w-full max-w-screen-md py-4 bg-white md:top-0 lg:max-w-full">
      <div className="px-10">
        <div className="flex items-center justify-between">
          <div className="flex shrink-0">
            <Link href="/dashboard" className="flex items-center">
              <h2 className="font-bold text-3xl text-gray-700">
                CAR{" "}
                <span className="bg-[#FF8295] text-white px-2 rounded-md">
                  TALLY
                </span>
              </h2>
            </Link>
          </div>
          <div className="flex items-center justify-end gap-3">
            <Link
              href="vehiclehistory"
              className="text-lg font-medium text-gray-900 hover:bg-gray-100 px-2 py-1 rounded-lg"
            >
              วิดีโอย้อนหลัง
            </Link>
            <Link
              href="analyze"
              className="text-lg font-medium text-gray-900 hover:bg-gray-100 px-2 py-1 rounded-lg"
            >
              การวิเคราะห์
            </Link>

            {jwt ? (
              <button
                className="inline-flex items-center justify-center rounded-xl bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-red-400"
                onClick={handleLogout}
              >
                ลงชื่อออก
              </button>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-400"
              >
                ลงชื่อเข้าใช้
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
