export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const cls =
    size === "lg" ? "text-3xl" : size === "sm" ? "text-base" : "text-xl";

  return (
    <span className={`font-bold tracking-tight ${cls}`}>
      Ticket<span className="text-brand">mundo</span>
      <span className="ml-1 text-xs font-normal opacity-60">admin</span>
    </span>
  );
}
