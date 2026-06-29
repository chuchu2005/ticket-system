import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const isAdmin = request.nextUrl.pathname.startsWith("/admin");
  const isLogin = request.nextUrl.pathname.startsWith("/login");
  const session = request.cookies.get("admin_session");

  if (isAdmin && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLogin && session) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login/:path*"],
};
