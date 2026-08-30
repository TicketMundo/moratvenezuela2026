import type { ReactNode } from "react";
import { DashboardHeader } from "@/components/admin/DashboardHeader";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-base-light dark:bg-base-dark">
      <DashboardHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
