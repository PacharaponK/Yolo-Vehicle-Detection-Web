"use client";
import { useState } from "react";

export default function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="font-sans text-gray-900 antialiased">
      <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-[#f8f4f3] relative overflow-hidden">
        {/* รถเคลื่อนที่อยู่ติดขอบจอด้านล่าง และอยู่หลัง component อื่นๆ */}
        <div className="absolute bottom-0 left-0 transform animate-carMove z-0">
          <img
            src="https://img.lovepik.com/element/40153/6500.png_1200.png" // เปลี่ยนเป็น URL ของรถที่คุณต้องการ
            alt="Car"
            className="h-36"
          />
        </div>
        <div className="z-10">
          <a href="/">
            <h2 className="font-bold text-3xl">
              CAR{" "}
              <span className="bg-[#FF8295] text-white px-2 rounded-md">
                TALLY
              </span>
            </h2>
          </a>
        </div>

        <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg animate-slideIn z-10">
          <form method="POST" action="/login">
            <div className="py-8 text-center">
              <span className="text-2xl font-semibold">Log In</span>
            </div>

            <div>
              <label
                className="block font-medium text-sm text-gray-700"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#FF8295]"
                required
              />
            </div>

            <div className="mt-4">
              <label
                className="block font-medium text-sm text-gray-700"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  required
                  className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#FF8295]"
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-600"
                >
                  {passwordVisible ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="block mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="remember"
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember Me</span>
              </label>
            </div>

            <div className="flex items-center justify-end mt-4">
              <a
                className="hover:underline text-sm text-gray-600 hover:text-gray-900"
                href="/password-reset"
              >
                Forgot your password?
              </a>
              <button
                type="submit"
                className="ml-4 inline-flex items-center px-4 py-2 bg-[#FF8295] border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-[#FF6A7F] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
