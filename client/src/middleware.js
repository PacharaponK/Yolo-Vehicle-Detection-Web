// src/middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  console.log("Middleware triggered for path:", pathname);

  // ดึง JWT และ email จาก cookie
  const jwt = req.cookies.get("jwt")?.value;
  const email = req.cookies.get("email")?.value;

  console.log("JWT in cookie:", jwt);
  console.log("Email in cookie:", email);

  // กำหนด protected paths
  const protectedPaths = ["/dashboard", "/vehiclehistory", "/analyze"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  console.log("Is this a protected path?", isProtected);

  // ถ้าเป็น protected path และไม่มี JWT หรือ email
  if (isProtected && (!jwt || !email)) {
    console.log("No JWT or email found, redirecting to /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // กำหนด email ที่มีสิทธิ์เข้าถึงทุกหน้า
  const privilegedEmails = ["admin@email.com", "chotmanat@email.com"];
  const isPrivileged = privilegedEmails.includes(email);
  console.log("Is user privileged?", isPrivileged);

  // ตรวจสอบการเข้าถึง
  if (isProtected) {
    if (isPrivileged) {
      // ผู้ใช้ privileged สามารถเข้าถึงทุกหน้า
      console.log("Privileged user access granted for:", pathname);
      return NextResponse.next();
    } else {
      // ผู้ใช้ทั่วไป (ไม่ใช่ privileged)
      if (pathname.startsWith("/vehiclehistory")) {
        console.log("General user access granted for /vehiclehistory");
        return NextResponse.next();
      } else {
        // ถ้าไม่ใช่ /vehiclehistory (เช่น /dashboard หรือ /analyze)
        console.log(
          "General user denied access to:",
          pathname,
          "redirecting to /unauthorized"
        );
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }
  }

  // หน้าไม่ protected อนุญาตให้ผ่าน
  console.log("Access granted for non-protected path:", pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/vehiclehistory/:path*", "/analyze/:path*"],
};
