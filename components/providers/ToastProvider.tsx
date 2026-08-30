"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Check, AlertCircle, Info, X } from "lucide-react";
import clsx from "clsx";

// ─── Types ───────────────────────────────────────────────────────────────────

type ToastKind = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  kind: ToastKind;
  visible: boolean;
}

interface ToastContextValue {
  toast: (message: string, kind?: ToastKind) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

// ─── Individual Toast item ────────────────────────────────────────────────────

const ICON: Record<ToastKind, ReactNode> = {
  success: <Check className="h-4 w-4 shrink-0" />,
  error: <AlertCircle className="h-4 w-4 shrink-0" />,
  info: <Info className="h-4 w-4 shrink-0" />,
};

const KIND_CLASSES: Record<ToastKind, string> = {
  success: "border-green-500 text-green-700 dark:text-green-400",
  error: "border-brand text-brand",
  info: "border-line-light dark:border-line-dark text-base-dark dark:text-base-light",
};

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  return (
    <div
      role="alert"
      onClick={() => onDismiss(toast.id)}
      className={clsx(
        "flex items-start gap-3 w-80 max-w-full cursor-pointer",
        "rounded-card border-l-4 px-4 py-3 shadow-lg",
        "bg-surface-light dark:bg-surface-dark",
        KIND_CLASSES[toast.kind],
        "transition-all duration-300",
        toast.visible
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-8 pointer-events-none"
      )}
    >
      {ICON[toast.kind]}
      <p className="flex-1 text-sm leading-snug">{toast.message}</p>
      <button
        type="button"
        aria-label="Cerrar notificación"
        className="opacity-60 hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          onDismiss(toast.id);
        }}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

const AUTO_DISMISS_MS = 4000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    // Start exit animation
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, visible: false } : t))
    );
    // Remove after transition
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timersRef.current.delete(id);
    }, 350);
  }, []);

  const addToast = useCallback(
    (message: string, kind: ToastKind = "info") => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, message, kind, visible: false }]);

      // Trigger enter animation on next tick
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setToasts((prev) =>
            prev.map((t) => (t.id === id ? { ...t, visible: true } : t))
          );
        });
      });

      // Auto-dismiss
      const timer = setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
      timersRef.current.set(id, timer);
    },
    [dismiss]
  );

  // Cleanup timers on unmount
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({
      toast: addToast,
      success: (msg) => addToast(msg, "success"),
      error: (msg) => addToast(msg, "error"),
      info: (msg) => addToast(msg, "info"),
    }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast container */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
