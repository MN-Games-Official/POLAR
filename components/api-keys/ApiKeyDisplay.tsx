import Link from "next/link";
import { KeyRound } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatDateTime, formatRelative } from "@/lib/formatters";
import type { ApiKeySummary } from "@/types";

export function ApiKeyDisplay({ apiKeys }: { apiKeys: ApiKeySummary[] }) {
  return (
    <Card className="dashboard-card">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-slate-500">Keys inventory</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Active credentials</h3>
        </div>
        <Link className="text-sm text-mint hover:text-white" href="/dashboard/api-keys/polaris">
          Generate key
        </Link>
      </div>
      <div className="space-y-4">
        {apiKeys.length ? (
          apiKeys.map((apiKey) => (
            <div
              key={apiKey.id}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-4 py-4"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-white/10 p-2 text-coral">
                      <KeyRound className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {apiKey.name || `${apiKey.type} integration`}
                      </p>
                      <p className="text-xs text-slate-500">{apiKey.key_prefix}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <Badge tone={apiKey.is_active ? "success" : "warning"}>
                    {apiKey.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <span>Used {apiKey.usage_count} times</span>
                  <span>{apiKey.last_used ? formatRelative(apiKey.last_used) : "Never used"}</span>
                  <span>Created {formatDateTime(apiKey.created_at)}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">
            No API keys yet. Add a Roblox key or generate a Polaris key to begin.
          </p>
        )}
      </div>
    </Card>
  );
}
