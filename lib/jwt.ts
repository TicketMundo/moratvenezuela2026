import jwt from "jsonwebtoken";
import type { SessionUser } from "./types";
export { COOKIE_NAME } from "./jwt-constants";

function secret(): string {
  const s = process.env.NEXTAUTH_SECRET;
  if (!s) throw new Error("NEXTAUTH_SECRET missing");
  return s;
}

export function signSession(session: SessionUser): string {
  return jwt.sign(
    { user: session.user, nombre: session.nombre },
    secret(),
    { expiresIn: "8h" }
  );
}

export function verifySession(token: string): SessionUser | null {
  try {
    const payload = jwt.verify(token, secret()) as Record<string, unknown>;
    if (typeof payload === "object" && payload?.user) {
      return {
        user: payload.user as string,
        nombre: (payload.nombre as string) ?? (payload.user as string)
      };
    }
    return null;
  } catch {
    return null;
  }
}
