"use client";
import { useEffect, useState, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { History, RotateCcw, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/providers/ToastProvider";
import type { BackupItem, MoratConfig } from "@/lib/types";
import type { MoratConfigInput } from "@/lib/schemas";

interface Props {
  open: boolean;
  onClose: () => void;
  eventoId: string;
}

function formatRelativeDate(isoString: string): string {
  try {
    const diff = Date.now() - new Date(isoString).getTime();
    const minutes = Math.floor(diff / 60_000);
    if (minutes < 2) return "hace un momento";
    if (minutes < 60) return `hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `hace ${hours}h`;
    const days = Math.floor(hours / 24);
    return `hace ${days}d`;
  } catch {
    return isoString;
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function BackupsModal({ open, onClose, eventoId }: Props) {
  const toast = useToast();
  const methods = useFormContext<MoratConfigInput>();

  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [confirmKey, setConfirmKey] = useState<string | null>(null);

  const fetchBackups = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/evento/${eventoId}/backups`, {
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Error al cargar backups");
      setBackups(json.backups ?? []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al cargar backups";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [eventoId, toast]);

  useEffect(() => {
    if (open) fetchBackups();
  }, [open, fetchBackups]);

  async function handleRestore(key: string) {
    setRestoring(key);
    setConfirmKey(null);
    try {
      const res = await fetch(
        `/api/admin/evento/${eventoId}/backups/restore`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key }),
          credentials: "include",
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Error al restaurar");

      // Reload form data
      const configRes = await fetch(`/api/admin/evento/${eventoId}`, {
        credentials: "include",
      });
      const configData: MoratConfig = await configRes.json();
      methods.reset(configData as MoratConfigInput);

      toast.success("Backup restaurado correctamente");
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al restaurar";
      toast.error(msg);
    } finally {
      setRestoring(null);
    }
  }

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title="Historial de backups"
        maxWidth="max-w-xl"
      >
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin opacity-50" />
          </div>
        ) : backups.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 opacity-50">
            <History className="h-8 w-8" />
            <p className="text-sm">Sin backups disponibles</p>
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-line-light dark:divide-line-dark">
            {backups.map((b) => (
              <li
                key={b.key}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{b.name}</p>
                  <p className="text-xs opacity-50 mt-0.5">
                    {formatRelativeDate(b.lastModified)} ·{" "}
                    {formatBytes(b.size)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  loading={restoring === b.key}
                  onClick={() => setConfirmKey(b.key)}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Restaurar
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Modal>

      <ConfirmDialog
        open={confirmKey !== null}
        title="Restaurar backup"
        message="Se reemplazará la configuración actual con este backup. Los cambios sin guardar se perderán. ¿Continuar?"
        confirmLabel="Restaurar"
        danger
        onConfirm={() => confirmKey && handleRestore(confirmKey)}
        onCancel={() => setConfirmKey(null)}
      />
    </>
  );
}
