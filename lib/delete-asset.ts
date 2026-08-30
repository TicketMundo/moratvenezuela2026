export async function deleteAsset(url: string): Promise<void> {
  if (!url || !url.startsWith("http")) return;
  try {
    const res = await fetch("/api/admin/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.warn("[deleteAsset] failed to delete from DO:", res.status, data, { url });
    }
  } catch (err) {
    console.warn("[deleteAsset] network error:", err, { url });
  }
}
