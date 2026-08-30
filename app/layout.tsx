import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/providers/ToastProvider";

export const metadata: Metadata = {
  title: "Morat · Ya Es Mañana World Tour — Caracas 2026",
  description: "Compra tus entradas para los mejores eventos en Venezuela con Ticketmundo.",
  icons: { icon: "/icon.png" },
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased font-sans">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
