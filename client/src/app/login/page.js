"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ax, { axData } from "../../../config/ax";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await ax.post("/api/user/login", {
        data: { email, password },
      });
      console.log("🚀 ~ handleLogin ~ res:", res);

      // ตรวจสอบว่า login สำเร็จหรือไม่
      if (res.status === 200) {
        const token = res.data.Token;
        // เก็บ JWT ใน sessionStorage
        sessionStorage.setItem("jwt", token);
        // เก็บ JWT ใน cookie เพื่อให้ Middleware ตรวจสอบได้
        document.cookie = `jwt=${token}; path=/; SameSite=Strict`;
        axData.jwt = token; // อัพเดต axData ด้วย JWT ใหม่
        router.push("/dashboard"); // เปลี่ยนเส้นทางไปหน้าหลัก
      }
    } catch (error) {
      console.log("🚀 ~ handleLogin ~ error:", error);
      if (error.response && error.response.data) {
        setError(error.response.data.message); // แสดงข้อความ error จาก response
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="font-sans text-gray-900 antialiased">
      <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-[#f8f4f3] relative overflow-hidden">
        {/* รถเคลื่อนที่อยู่ติดขอบจอด้านล่าง */}
        <div className="absolute bottom-0 left-0 transform animate-carMove z-0">
          <img
            src="https://img.lovepik.com/element/40153/6500.png_1200.png"
            alt="Car"
            className="h-36"
          />
        </div>

        {/* Header */}
        <div className="z-10">
          <Link href="/">
            <h2 className="font-bold text-3xl">
              CAR{" "}
              <span className="bg-[#FF8295] text-white px-2 rounded-md">
                TALLY
              </span>
            </h2>
          </Link>
        </div>

        {/* Login Form */}
        <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg animate-slideIn z-10">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <form onSubmit={handleLogin}>
            <div className="py-8 text-center">
              <span className="text-2xl font-semibold">ลงชื่อเข้าใช้ ZZZ</span>
            </div>

            {/* Email */}
            <div>
              <label className="block font-medium text-sm text-gray-700">
                อีเมล
              </label>
              <input
                type="email"
                name="email"
                placeholder="อีเมล"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#FF8295]"
                required
              />
            </div>

            {/* Password */}
            <div className="mt-4">
              <label className="block font-medium text-sm text-gray-700">
                รหัสผ่าน
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  placeholder="รหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-md py-2.5 px-4 border text-sm outline-[#FF8295]"
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500 hover:text-gray-600"
                >
                  {passwordVisible ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="block mt-4">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="ml-2 text-sm text-gray-600">จดจำฉันไว้</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-4">
              <Link
                className="text-sm text-gray-600 hover:text-gray-900"
                href="/password-reset"
              >
                ลืมรหัสผ่าน?
              </Link>
              <button
                type="submit"
                className="ml-4 px-4 py-2 bg-[#FF8295] rounded-md text-white font-semibold"
              >
                ลงชื่อเข้าใช้
              </button>
            </div>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <span className="text-sm">ไม่มีบัญชีหรอ? </span>
              <Link className="text-[#FF8295] hover:underline" href="/register">
                สมัครสมาชิกที่นี่
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
