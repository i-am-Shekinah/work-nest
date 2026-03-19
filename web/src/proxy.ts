import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { appConfig } from "@/lib/config";

const publicRoutes = ["/login", "/forgot-password", "/reset-password", "/register"];

export function proxy(request: NextRequest) {
  const session = request.cookies.get(appConfig.sessionCookieName)?.value;
  const pathname = request.nextUrl.pathname;

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isApiRoute = pathname.startsWith("/api");
  const isStaticAsset =
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon");

  if (isApiRoute || isStaticAsset) {
    return NextResponse.next();
  }

  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
