import { redirect } from "next/navigation";

export default function DashboardPage() {
  const eventoId = process.env.DEFAULT_EVENTO_ID || "MORAT";
  redirect(`/admin/dashboard/${eventoId}`);
}
