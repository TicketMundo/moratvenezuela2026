"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

const forced = process.env.NEXT_PUBLIC_MODE === "light" ? "light" : "dark";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={forced}
      forcedTheme={forced}
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
