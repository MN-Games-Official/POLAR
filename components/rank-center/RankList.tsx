"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { apiClient } from "@/lib/api-client";
import { formatDateTime } from "@/lib/formatters";

type RankCenterListItem = {
  id: string;
  name: string;
  group_id: string;
  universe_id?: string | null;
  rank_count: number;
  created_at: string;
  updated_at: string;
};

export function RankList({ rankCenters }: { rankCenters: RankCenterListItem[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      rankCenters.filter((center) =>
        `${center.name} ${center.group_id} ${center.universe_id ?? ""}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query, rankCenters]
  );

  return (
    <Card className="dashboard-card">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Input
          className="md:max-w-md"
          placeholder="Search rank centers"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Button type="button" onClick={() => router.push("/dashboard/rank-center/new")}>
          <Plus className="h-4 w-4" />
          New rank center
        </Button>
      </div>
      <div className="space-y-4">
        {filtered.length ? (
          filtered.map((center) => (
            <div
              key={center.id}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-5"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <p className="text-lg font-semibold text-white">{center.name}</p>
                  <p className="mt-2 text-sm text-slate-400">
                    Group {center.group_id}
                    {center.universe_id ? ` • Universe ${center.universe_id}` : ""}
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                    Created {formatDateTime(center.created_at)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-300">
                    {center.rank_count} ranks
                  </span>
                  <Button type="button" variant="secondary" onClick={() => router.push(`/dashboard/rank-center/${center.id}`)}>
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={async () => {
                      await apiClient(`/api/rank-centers/${center.id}`, { method: "DELETE" });
                      router.refresh();
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">No rank centers match your search.</p>
        )}
      </div>
    </Card>
  );
}
