import { NextResponse } from "next/server";
import { uploadBuffer, assetKey, deleteObject, urlToKey } from "@/lib/s3-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const ID_RX = /^[a-z0-9-]+$/i;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(req: Request) {
  try {
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const file = formData.get("file");
    const eventoIdRaw = formData.get("eventoId");
    const eventoId =
      typeof eventoIdRaw === "string" && eventoIdRaw.trim() !== ""
        ? eventoIdRaw.trim()
        : "shared";

    if (!ID_RX.test(eventoId)) {
      return NextResponse.json({ error: "Invalid eventoId" }, { status: 400 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file field is required" }, { status: 400 });
    }

    if (!(ALLOWED_TYPES as readonly string[]).includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG and WebP files are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: "File exceeds 10 MB limit" }, { status: 400 });
    }

    const ext = MIME_TO_EXT[file.type] ?? "bin";

    const baseName = file.name.replace(/\.[^.]+$/, "");
    const sanitized =
      baseName
        .replace(/[^a-zA-Z0-9-_]/g, "-")
        .toLowerCase()
        .slice(0, 60) || "file";

    const filename = `${Date.now()}-${sanitized}.${ext}`;
    const key = assetKey(eventoId, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadBuffer(key, buffer, file.type);

    return NextResponse.json({ url, key });
  } catch (err) {
    console.error("[upload POST]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const url = typeof body?.url === "string" ? body.url.trim() : "";
    if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });

    const key = urlToKey(url);
    if (!key) return NextResponse.json({ error: "URL not from this bucket" }, { status: 400 });

    // Forbid deleting config files or backups
    if (key.endsWith(".json") || key.includes("/backups/")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await deleteObject(key);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[upload DELETE]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
