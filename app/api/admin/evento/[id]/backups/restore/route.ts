import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { moratConfigSchema } from "@/lib/schemas";
import { configKey, backupKey, readJson, writeJson, copyObject } from "@/lib/s3-client";

export const runtime = "nodejs";

const ID_RX = /^[a-z0-9-]+$/i;

export async function POST(
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

  const { key } = (body ?? {}) as { key?: string };

  if (typeof key !== "string" || !key.startsWith(`eventos/${id}/backups/`)) {
    return NextResponse.json(
      { error: `key must start with eventos/${id}/backups/` },
      { status: 400 }
    );
  }

  try {
    const backupData = await readJson(key);
    if (backupData === null) {
      return NextResponse.json({ error: "Backup not found" }, { status: 404 });
    }

    let parsed: unknown;
    try {
      parsed = moratConfigSchema.parse(backupData);
    } catch (err) {
      if (err instanceof ZodError) {
        return NextResponse.json(
          { error: "Backup data invalid", details: err.flatten() },
          { status: 422 }
        );
      }
      throw err;
    }

    const currentKey = configKey(id);
    let backedUpAs: string | null = null;

    const current = await readJson(currentKey);
    if (current !== null) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      backedUpAs = backupKey(id, timestamp);
      await copyObject(currentKey, backedUpAs);
    }

    await writeJson(currentKey, parsed);

    return NextResponse.json({ ok: true, restoredFrom: key, backedUpAs });
  } catch (err) {
    console.error("[restore POST]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
