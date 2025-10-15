import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(req: NextRequest) {
  const sessionCookie = getSessionCookie(req);
  const isDashboardRoute = req.nextUrl.pathname.startsWith("/dashboard");
  const isAuthRoute = req.nextUrl.pathname.startsWith("/auth");

  if (isAuthRoute && sessionCookie) {
    const dashboardUrl = new URL("dashboard", req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  if (isDashboardRoute && !sessionCookie) {
    const loginUrl = new URL("auth/sign-in", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/jobs/:path*"], 
};
