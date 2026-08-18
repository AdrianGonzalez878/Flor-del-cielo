import { NextResponse } from "next/server";

import { COOKIE_NAME } from "@/lib/studio-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secure = new URL(request.url).protocol === "https:";
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
