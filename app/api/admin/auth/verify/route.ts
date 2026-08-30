import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySession } from "@/lib/jwt";
import { COOKIE_NAME } from "@/lib/jwt-constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const session = verifySession(token);
    if (!session) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    return NextResponse.json({ ok: true, user: { user: session.user, nombre: session.nombre } });
  } catch (err) {
    console.error("[verify]", err);
    return NextResponse.json({ ok: false }, { status: 401 });
  }
}
