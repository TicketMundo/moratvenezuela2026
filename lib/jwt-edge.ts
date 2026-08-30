import type { SessionUser } from "./types";

function base64UrlDecode(str: string): Uint8Array {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  const b64 = (str + pad).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function base64UrlDecodeToString(str: string): string {
  return new TextDecoder().decode(base64UrlDecode(str));
}

export async function verifySessionEdge(
  token: string,
  secret: string
): Promise<SessionUser | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, sigB64] = parts;

    const header = JSON.parse(base64UrlDecodeToString(headerB64)) as { alg?: string };
    if (header.alg !== "HS256") return null;

    const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const sig = base64UrlDecode(sigB64);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sig as unknown as BufferSource,
      data as unknown as BufferSource
    );
    if (!valid) return null;

    const payload = JSON.parse(base64UrlDecodeToString(payloadB64)) as {
      exp?: number;
      user?: string;
      nombre?: string;
    };
    if (payload.exp && Date.now() / 1000 > payload.exp) return null;
    if (!payload.user) return null;
    return {
      user: payload.user,
      nombre: payload.nombre ?? payload.user
    };
  } catch {
    return null;
  }
}
