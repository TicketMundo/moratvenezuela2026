import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  CopyObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand
} from "@aws-sdk/client-s3";

let _client: S3Client | null = null;

export function getS3Client(): S3Client {
  if (_client) return _client;
  const endpoint = process.env.DO_SPACES_ENDPOINT;
  const region = process.env.DO_SPACES_REGION;
  const accessKeyId = process.env.DO_SPACES_KEY;
  const secretAccessKey = process.env.DO_SPACES_SECRET;
  if (!endpoint || !region || !accessKeyId || !secretAccessKey) {
    throw new Error("DO Spaces credentials missing in env");
  }
  _client = new S3Client({
    endpoint,
    region,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: false
  });
  return _client;
}

export function bucketName(): string {
  const b = process.env.DO_SPACES_BUCKET;
  if (!b) throw new Error("DO_SPACES_BUCKET missing");
  return b;
}

export function getPublicUrl(key: string): string {
  const custom = process.env.DO_SPACES_PUBLIC_URL;
  if (custom) return `${custom.replace(/\/$/, "")}/${key}`;
  const endpoint = process.env.DO_SPACES_ENDPOINT?.replace(/\/$/, "") ?? "";
  const bucket = bucketName();
  // DO Spaces virtual-hosted style: https://<bucket>.<region>.digitaloceanspaces.com/<key>
  try {
    const u = new URL(endpoint);
    return `https://${bucket}.${u.host}/${key}`;
  } catch {
    return `${endpoint}/${bucket}/${key}`;
  }
}

export async function readJson<T>(key: string): Promise<T | null> {
  try {
    const res = await getS3Client().send(
      new GetObjectCommand({ Bucket: bucketName(), Key: key })
    );
    const body = await res.Body?.transformToString();
    if (!body) return null;
    return JSON.parse(body) as T;
  } catch (err: unknown) {
    const e = err as { name?: string; $metadata?: { httpStatusCode?: number } };
    if (e?.name === "NoSuchKey" || e?.$metadata?.httpStatusCode === 404) return null;
    throw err;
  }
}

export async function writeJson(key: string, data: unknown): Promise<void> {
  await getS3Client().send(
    new PutObjectCommand({
      Bucket: bucketName(),
      Key: key,
      Body: JSON.stringify(data, null, 2),
      ContentType: "application/json",
      ACL: "public-read",
      CacheControl: "no-cache, max-age=0"
    })
  );
}

export async function copyObject(srcKey: string, destKey: string): Promise<void> {
  await getS3Client().send(
    new CopyObjectCommand({
      Bucket: bucketName(),
      CopySource: `/${bucketName()}/${encodeURIComponent(srcKey)}`,
      Key: destKey,
      ACL: "public-read"
    })
  );
}

export async function deleteObject(key: string): Promise<void> {
  await getS3Client().send(
    new DeleteObjectCommand({ Bucket: bucketName(), Key: key })
  );
}

export function urlToKey(url: string): string | null {
  try {
    // Try CDN/custom public URL first
    const custom = process.env.DO_SPACES_PUBLIC_URL;
    if (custom) {
      const base = custom.replace(/\/$/, "") + "/";
      if (url.startsWith(base)) return url.slice(base.length);
    }
    // Fallback: virtual-hosted bucket URL (bucket.region.digitaloceanspaces.com/key)
    const endpoint = process.env.DO_SPACES_ENDPOINT?.replace(/\/$/, "") ?? "";
    if (!endpoint) return null;
    const bucket = bucketName();
    const endpointHost = new URL(endpoint).host;
    const u = new URL(url);
    if (u.host === `${bucket}.${endpointHost}`) return u.pathname.slice(1);
    return null;
  } catch {
    return null;
  }
}

export async function listObjects(prefix: string) {
  const res = await getS3Client().send(
    new ListObjectsV2Command({ Bucket: bucketName(), Prefix: prefix })
  );
  return (res.Contents ?? []).map((o) => ({
    Key: o.Key!,
    LastModified: o.LastModified ?? new Date(0),
    Size: o.Size ?? 0
  }));
}

export async function uploadBuffer(
  key: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  await getS3Client().send(
    new PutObjectCommand({
      Bucket: bucketName(),
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: "public-read",
      CacheControl: "public, max-age=31536000, immutable"
    })
  );
  return getPublicUrl(key);
}

function eventsPrefix(): string {
  const raw = process.env.DO_SPACES_EVENTS_PREFIX ?? "eventos";
  return raw.replace(/^\/+|\/+$/g, "");
}

export function eventFolder(eventoId: string): string {
  const prefix = eventsPrefix();
  return prefix ? `${prefix}/${eventoId}` : eventoId;
}

export function configKey(eventoId: string): string {
  return `${eventFolder(eventoId)}/config.json`;
}

export function backupKey(eventoId: string, isoTimestamp: string): string {
  return `${eventFolder(eventoId)}/backups/config.bk.${isoTimestamp}.json`;
}

export function backupsPrefix(eventoId: string): string {
  return `${eventFolder(eventoId)}/backups/`;
}

export function assetKey(eventoId: string, filename: string): string {
  return `${eventFolder(eventoId)}/${filename}`;
}
