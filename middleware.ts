import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PUBLIC_ROUTES } from "@/lib/constants";

function isPublic(pathname: string) {
  return PUBLIC_ROUTES.includes(pathname) || pathname.startsWith("/verify-email");
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("polaris_access")?.value;

  if (!token && !isPublic(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isPublic(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
