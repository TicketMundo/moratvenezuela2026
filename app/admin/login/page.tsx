"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/schemas";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/admin/Logo";
import { useToast } from "@/components/providers/ToastProvider";

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { user: "", password: "" },
  });

  async function onSubmit(values: LoginInput) {
    setServerError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      });
      const json = await res.json();
      if (!res.ok) {
        const msg = json.error ?? "Error al iniciar sesión";
        setServerError(msg);
        toast.error(msg);
        return;
      }
      const nombre = json.user?.nombre ?? json.user?.user ?? "";
      toast.success(`Bienvenido${nombre ? `, ${nombre}` : ""}`);
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error de red";
      setServerError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-base-light dark:bg-base-dark">
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        <Logo size="lg" />

        <Card className="w-full">
          <h1 className="text-xl font-semibold mb-1">Iniciar sesión</h1>
          <p className="text-sm opacity-70 mb-6">
            Acceso al panel de administración
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <Input
              label="Usuario"
              id="user"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              {...register("user")}
              error={errors.user?.message}
            />
            <div className="relative">
              <Input
                label="Contraseña"
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className="pr-10"
                {...register("password")}
                error={errors.password?.message}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                aria-pressed={showPassword}
                tabIndex={-1}
                className="absolute right-2 top-7 h-8 w-8 inline-flex items-center justify-center rounded-input opacity-60 hover:opacity-100 transition-opacity"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {serverError && (
              <div role="alert" className="text-sm text-brand">
                {serverError}
              </div>
            )}

            <Button type="submit" loading={loading}>
              Entrar
            </Button>
          </form>
        </Card>

        <p className="text-xs opacity-50">Solo personal autorizado</p>
      </div>
    </main>
  );
}
