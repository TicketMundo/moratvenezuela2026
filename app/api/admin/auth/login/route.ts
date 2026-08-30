import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/schemas";
import { signSession } from "@/lib/jwt";
import { COOKIE_NAME } from "@/lib/jwt-constants";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0]?.message ?? "Validation error" },
        { status: 400 }
      );
    }

    const { user, password } = result.data;

    const devBypass =
      process.env.NODE_ENV !== "production" &&
      process.env.AUTH_BYPASS === "true";

    let nombre = user;

    if (devBypass) {
      console.warn(
        "[login] DEV BYPASS active — skipping core API. Set AUTH_BYPASS=false to disable."
      );
    } else {
      const coreUrl = process.env.CORE_API_URL;
      if (!coreUrl) {
        return NextResponse.json({ error: "Core API not configured" }, { status: 500 });
      }

      const coreEndpoint = `${coreUrl}/Account/Login`;
      const requestHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const requestBody = JSON.stringify({ user, password });

      console.log("[login] → request", {
        url: coreEndpoint,
        method: "POST",
        headers: requestHeaders,
        body: { user, password: "***" },
        bodyRaw: requestBody.replace(
          /"password":"[^"]*"/,
          '"password":"***"'
        ),
      });

      const startedAt = Date.now();
      const coreRes = await fetch(coreEndpoint, {
        method: "POST",
        headers: requestHeaders,
        body: requestBody,
      });
      const elapsedMs = Date.now() - startedAt;

      const responseHeaders: Record<string, string> = {};
      coreRes.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      const rawBody = await coreRes.text();
      let parsedBody: unknown = null;
      try {
        parsedBody = rawBody ? JSON.parse(rawBody) : null;
      } catch {
        parsedBody = rawBody;
      }

      console.log("[login] ← response", {
        status: coreRes.status,
        statusText: coreRes.statusText,
        elapsedMs,
        contentType: coreRes.headers.get("content-type"),
        headers: responseHeaders,
        body: parsedBody,
      });

      if (!coreRes.ok) {
        return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
      }

      const coreData: unknown = typeof parsedBody === "object" && parsedBody !== null ? parsedBody : {};

      const d = coreData as Record<string, unknown>;
      const inner = (d?.data ?? {}) as Record<string, unknown>;
      const userObj = (inner?.user ?? {}) as Record<string, unknown>;

      nombre =
        (inner?.nombre as string | undefined) ??
        (userObj?.nombre as string | undefined) ??
        (inner?.name as string | undefined) ??
        (userObj?.name as string | undefined) ??
        user;
    }

    const sessionUser = { user, nombre };
    const token = signSession(sessionUser);

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 8 * 60 * 60,
    });

    return NextResponse.json({ ok: true, user: { user, nombre } });
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
