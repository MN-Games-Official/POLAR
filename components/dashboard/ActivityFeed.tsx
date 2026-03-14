import { formatRelative } from "@/lib/formatters";
import type { ActivityItem } from "@/types";

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <section className="dashboard-card">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-slate-500">Recent activity</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Operator feed</h3>
        </div>
      </div>
      <div className="space-y-4">
        {items.length ? (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] px-4 py-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{item.description}</p>
                </div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                  {formatRelative(item.timestamp)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">No activity has been recorded yet.</p>
        )}
      </div>
    </section>
  );
}
