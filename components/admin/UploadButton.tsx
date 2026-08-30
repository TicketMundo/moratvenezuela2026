"use client";
import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/providers/ToastProvider";

interface Props {
  eventoId: string;
  onUploaded: (url: string) => void;
  accept?: string;
  label?: string;
}

export function UploadButton({
  eventoId,
  onUploaded,
  accept = "image/jpeg,image/png,image/webp",
  label = "Subir",
}: Props) {
  const ref = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("eventoId", eventoId);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      onUploaded(json.url);
      toast.success("Imagen subida");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al subir";
      toast.error(message);
    } finally {
      setLoading(false);
      if (ref.current) ref.current.value = "";
    }
  }

  return (
    <>
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={onChange}
        aria-hidden="true"
      />
      <Button
        type="button"
        variant="secondary"
        size="sm"
        loading={loading}
        onClick={() => ref.current?.click()}
      >
        <Upload className="h-4 w-4" />
        {label}
      </Button>
    </>
  );
}
