const COOKIE_NAME = "fdc_studio_session";
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

export { COOKIE_NAME };

export function isStudioAuthEnabled(): boolean {
  return Boolean(process.env.STUDIO_AUTH_PASSWORD?.trim());
}

export function getStudioAuthUser(): string {
  return process.env.STUDIO_AUTH_USER?.trim() || "admin";
}

export function getStudioAuthSecret(): string {
  const secret = process.env.STUDIO_AUTH_SECRET?.trim();
  if (secret) return secret;
  const password = process.env.STUDIO_AUTH_PASSWORD?.trim();
  if (password) return password;
  return "fdc-studio-dev-secret";
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function signPayload(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return toBase64Url(new Uint8Array(signature));
}

export async function createSessionToken(user: string): Promise<string> {
  const exp = Date.now() + SESSION_MS;
  const payload = `${user}:${exp}`;
  const signature = await signPayload(payload, getStudioAuthSecret());
  return `${toBase64Url(new TextEncoder().encode(payload))}.${signature}`;
}

export async function verifySessionToken(
  token: string | undefined | null,
): Promise<boolean> {
  if (!token || !isStudioAuthEnabled()) return !isStudioAuthEnabled();
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return false;

  try {
    const payloadBytes = fromBase64Url(encodedPayload);
    const payload = new TextDecoder().decode(payloadBytes);
    const expected = await signPayload(payload, getStudioAuthSecret());
    if (signature.length !== expected.length) return false;

    let mismatch = 0;
    for (let i = 0; i < signature.length; i += 1) {
      mismatch |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
    }
    if (mismatch !== 0) return false;

    const [, expRaw] = payload.split(":");
    const exp = Number(expRaw);
    return Number.isFinite(exp) && exp > Date.now();
  } catch {
    return false;
  }
}

export function getSessionCookieOptions(secure: boolean) {
  return {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MS / 1000,
  };
}
