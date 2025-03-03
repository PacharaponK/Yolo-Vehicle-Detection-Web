// src/middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  console.log("Middleware triggered for path:", pathname); // Debug

  const jwt = req.cookies.get("jwt")?.value;
  console.log("JWT in cookie:", jwt); // Debug

  const protectedPaths = ["/dashboard"];

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  console.log("Is this a protected path?", isProtected); // Debug

  if (isProtected && !jwt) {
    console.log("No JWT found, redirecting to /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  console.log("Access granted for:", pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
