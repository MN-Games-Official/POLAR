"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { apiClient } from "@/lib/api-client";
import { formatDateTime, formatPercent } from "@/lib/formatters";

type ApplicationListItem = {
  id: string;
  name: string;
  description?: string | null;
  group_id: string;
  created_at: string;
  updated_at: string;
  submission_count: number;
  pass_count: number;
};

export function ApplicationList({
  applications,
  stats
}: {
  applications: ApplicationListItem[];
  stats: { total: number; submissions: number; passRate: number };
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("updated");

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase();
    const items = applications.filter((application) =>
      `${application.name} ${application.description ?? ""}`.toLowerCase().includes(normalized)
    );

    return items.sort((a, b) =>
      sort === "created"
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  }, [applications, query, sort]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="dashboard-card">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Total apps</p>
          <p className="mt-3 text-4xl font-semibold text-white">{stats.total}</p>
        </Card>
        <Card className="dashboard-card">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Submissions</p>
          <p className="mt-3 text-4xl font-semibold text-white">{stats.submissions}</p>
        </Card>
        <Card className="dashboard-card">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Pass rate</p>
          <p className="mt-3 text-4xl font-semibold text-white">{formatPercent(stats.passRate)}</p>
        </Card>
      </div>

      <Card className="dashboard-card">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-4 md:flex-row">
            <Input
              className="md:max-w-md"
              placeholder="Search applications"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Select className="md:max-w-xs" value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="updated">Recently updated</option>
              <option value="created">Recently created</option>
            </Select>
          </div>
          <Button type="button" onClick={() => router.push("/dashboard/application-center/new")}>
            <Plus className="h-4 w-4" />
            New application
          </Button>
        </div>

        <div className="space-y-4">
          {filtered.length ? (
            filtered.map((application) => {
              const passRate =
                application.submission_count > 0
                  ? Math.round((application.pass_count / application.submission_count) * 100)
                  : 0;

              return (
                <div
                  key={application.id}
                  className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-5"
                >
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-white">{application.name}</p>
                      <p className="mt-2 max-w-2xl text-sm text-slate-400">
                        {application.description || "No description provided."}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em] text-slate-500">
                        <span>Group {application.group_id}</span>
                        <span>Created {formatDateTime(application.created_at)}</span>
                        <span>Updated {formatDateTime(application.updated_at)}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-300">
                        {application.submission_count} submissions
                      </span>
                      <span className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-300">
                        {passRate}% pass rate
                      </span>
                      <Button type="button" variant="secondary" onClick={() => router.push(`/dashboard/application-center/${application.id}`)}>
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={async () => {
                          await apiClient(`/api/applications/${application.id}`, { method: "DELETE" });
                          router.refresh();
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-slate-400">No applications match your search.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
