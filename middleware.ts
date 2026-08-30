import { NextResponse, type NextRequest } from "next/server";
import { verifySessionEdge } from "@/lib/jwt-edge";
import { COOKIE_NAME } from "@/lib/jwt-constants";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;
  const secret = process.env.NEXTAUTH_SECRET;

  if (!token || !secret) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  const user = await verifySessionEdge(token, secret);
  if (!user) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"]
};
