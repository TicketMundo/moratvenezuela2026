import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { moratConfigSchema } from "@/lib/schemas";
import { configKey, backupKey, readJson, writeJson, copyObject } from "@/lib/s3-client";
import { DEFAULT_MORAT_CONFIG, type MoratConfig } from "@/lib/types";

export const runtime = "nodejs";

const ID_RX = /^[a-z0-9-]+$/i;

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!ID_RX.test(id)) {
    return NextResponse.json({ error: "Invalid evento id" }, { status: 400 });
  }

  try {
    const raw = await readJson<unknown>(configKey(id));
    // A brand new event starts from the seeded template instead of a blank form.
    const parsed = raw ? moratConfigSchema.safeParse(raw) : null;
    const payload: MoratConfig = parsed?.success
      ? (parsed.data as MoratConfig)
      : DEFAULT_MORAT_CONFIG;

    return NextResponse.json(payload, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("[evento GET]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!ID_RX.test(id)) {
    return NextResponse.json({ error: "Invalid evento id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  let parsed: MoratConfig;
  try {
    parsed = moratConfigSchema.parse(body) as MoratConfig;
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Validación fallida", details: err.flatten() },
        { status: 400 }
      );
    }
    throw err;
  }

  try {
    const key = configKey(id);
    let backedUpAs: string | null = null;

    const current = await readJson(key);
    if (current !== null) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      backedUpAs = backupKey(id, timestamp);
      await copyObject(key, backedUpAs);
    }

    await writeJson(key, parsed);
    revalidatePath("/");

    return NextResponse.json({ ok: true, backedUpAs });
  } catch (err) {
    console.error("[evento PUT]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
