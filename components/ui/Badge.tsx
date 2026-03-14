import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "default"
}: {
  children: ReactNode;
  tone?: "default" | "success" | "warning";
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.18em]",
        tone === "default" && "bg-white/8 text-slate-300",
        tone === "success" && "bg-emerald-400/12 text-emerald-200",
        tone === "warning" && "bg-amber-400/12 text-amber-200"
      )}
    >
      {children}
    </span>
  );
}
