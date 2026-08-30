"use client";
import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import clsx from "clsx";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** Max width class, defaults to "max-w-lg" */
  maxWidth?: string;
}

export function Modal({ open, onClose, title, children, maxWidth = "max-w-lg" }: Props) {
  // Close on ESC
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={clsx(
          "relative w-full rounded-card border border-line-light dark:border-line-dark",
          "bg-surface-light dark:bg-surface-dark shadow-2xl",
          "flex flex-col max-h-[90vh]",
          maxWidth
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between gap-4 border-b border-line-light dark:border-line-dark px-5 py-4">
            <h2 className="font-semibold text-base leading-snug">{title}</h2>
            <button
              type="button"
              aria-label="Cerrar"
              onClick={onClose}
              className="h-7 w-7 inline-flex items-center justify-center rounded-input hover:bg-base-light dark:hover:bg-base-dark transition-colors opacity-70 hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Close button when no title */}
        {!title && (
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="absolute top-3 right-3 h-7 w-7 inline-flex items-center justify-center rounded-input hover:bg-base-light dark:hover:bg-base-dark transition-colors opacity-70 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
