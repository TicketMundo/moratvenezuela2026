import { NextResponse } from "next/server";
import { listObjects, backupsPrefix } from "@/lib/s3-client";

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
    const prefix = backupsPrefix(id);
    const objects = await listObjects(prefix);

    const sorted = [...objects].sort(
      (a, b) => b.LastModified.getTime() - a.LastModified.getTime()
    );

    const backups = sorted.slice(0, 10).map((obj) => ({
      key: obj.Key,
      name: obj.Key.slice(prefix.length),
      lastModified: obj.LastModified.toISOString(),
      size: obj.Size,
    }));

    return NextResponse.json({ backups });
  } catch (err) {
    console.error("[backups GET]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
