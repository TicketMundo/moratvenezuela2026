"use client";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

export type SaveStatus =
  | "clean"
  | "dirty"
  | "saving"
  | "saved"
  | "error";

interface Props {
  status: SaveStatus;
}

const CONFIG: Record<
  SaveStatus,
  { label: string; className: string; spin?: boolean }
> = {
  clean: {
    label: "Sin cambios",
    className: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
  },
  dirty: {
    label: "Cambios sin guardar",
    className:
      "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  },
  saving: {
    label: "Guardando...",
    className: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    spin: true,
  },
  saved: {
    label: "Guardado ✓",
    className:
      "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  },
  error: {
    label: "Error al guardar",
    className: "bg-brand/10 text-brand",
  },
};

export function StatusBadge({ status }: Props) {
  const { label, className, spin } = CONFIG[status];

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        className
      )}
    >
      {spin && <Loader2 className="h-3 w-3 animate-spin" />}
      {label}
    </span>
  );
}
