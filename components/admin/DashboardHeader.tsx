"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/providers/ToastProvider";
import { LogOut } from "lucide-react";

interface UserInfo {
  user: string;
  nombre?: string;
}

export function DashboardHeader() {
  const router = useRouter();
  const toast = useToast();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch("/api/admin/auth/verify", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && data.user) setUser(data.user);
      })
      .catch(() => {
        // silent — user just won't see the email
      });
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      router.push("/admin/login");
    } catch {
      toast.error("Error al cerrar sesión");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line-light dark:border-line-dark bg-surface-light dark:bg-surface-dark">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Logo size="sm" />

        <div className="flex items-center gap-3">
          {user && (
            <span className="hidden sm:block text-sm opacity-60 truncate max-w-[200px]">
              {user.nombre ?? user.user}
            </span>
          )}
          <ThemeToggle />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            loading={loggingOut}
            onClick={handleLogout}
            aria-label="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Salir</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
