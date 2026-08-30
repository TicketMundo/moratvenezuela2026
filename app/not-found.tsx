import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="text-lg opacity-70">Página no encontrada</p>
      <Link
        href="/"
        className="mt-4 inline-block px-5 py-2 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand-hover transition-colors"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
