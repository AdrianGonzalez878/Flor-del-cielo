import { NextResponse, type NextRequest } from "next/server";

import {
  COOKIE_NAME,
  isStudioAuthEnabled,
  verifySessionToken,
} from "@/lib/studio-auth";

export async function middleware(request: NextRequest) {
  if (!isStudioAuthEnabled()) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/studio/login")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const valid = await verifySessionToken(token);
  if (valid) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/studio/login", request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/studio", "/studio/:path*"],
};
