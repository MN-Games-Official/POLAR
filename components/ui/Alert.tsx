import { cn } from "@/lib/utils";

export function Alert({
  title,
  description,
  tone = "info"
}: {
  title: string;
  description?: string;
  tone?: "info" | "success" | "warning" | "danger";
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border px-4 py-3",
        tone === "info" && "border-sky-400/20 bg-sky-400/10",
        tone === "success" && "border-emerald-400/20 bg-emerald-400/10",
        tone === "warning" && "border-amber-400/20 bg-amber-400/10",
        tone === "danger" && "border-rose-400/20 bg-rose-400/10"
      )}
    >
      <p className="text-sm font-semibold text-white">{title}</p>
      {description ? <p className="mt-1 text-xs text-slate-200">{description}</p> : null}
    </div>
  );
}
