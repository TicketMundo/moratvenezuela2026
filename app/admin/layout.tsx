import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
