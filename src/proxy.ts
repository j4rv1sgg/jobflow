import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function proxy(req: NextRequest) {
  const session = getSessionCookie(req);
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/auth") || pathname.startsWith("/_next") || pathname.startsWith("/api/public") || pathname.startsWith("/favicon.ico")) {
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL("/auth/sign-in", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|auth|api/public|favicon.ico).*)", // skip auth and static routes
  ],
};
