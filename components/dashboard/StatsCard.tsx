import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function StatsCard({
  label,
  value,
  detail
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <Card className="dashboard-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-slate-500">{label}</p>
          <p className="mt-4 text-4xl font-semibold text-white">{value}</p>
        </div>
        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 p-2 text-emerald-200">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-5 text-sm text-slate-400">{detail}</p>
    </Card>
  );
}
