import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/jwt-constants";

export const runtime = "nodejs";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[logout]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
