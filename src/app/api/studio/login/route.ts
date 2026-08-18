import { timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import {
  COOKIE_NAME,
  createSessionToken,
  getSessionCookieOptions,
  getStudioAuthUser,
  isStudioAuthEnabled,
} from "@/lib/studio-auth";

export const runtime = "nodejs";

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(request: Request) {
  if (!isStudioAuthEnabled()) {
    return NextResponse.json(
      { error: "El acceso al Studio no está protegido en este entorno." },
      { status: 503 },
    );
  }

  let body: { username?: string; password?: string };
  try {
    body = (await request.json()) as { username?: string; password?: string };
  } catch {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const username = String(body.username ?? "").trim();
  const password = String(body.password ?? "");

  const validUser = safeEqual(username, getStudioAuthUser());
  const validPassword = safeEqual(password, process.env.STUDIO_AUTH_PASSWORD ?? "");

  if (!validUser || !validPassword) {
    return NextResponse.json(
      { error: "Usuario o contraseña incorrectos." },
      { status: 401 },
    );
  }

  if (!process.env.STUDIO_AUTH_SECRET?.trim()) {
    console.warn(
      "Studio auth: define STUDIO_AUTH_SECRET en producción para firmar sesiones con más seguridad.",
    );
  }

  const token = await createSessionToken(username);
  const secure = new URL(request.url).protocol === "https:";
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, token, getSessionCookieOptions(secure));
  return response;
}
