import Link from "next/link";
import { Header } from "@/components/Header";
import { ApiKeyDisplay } from "@/components/api-keys/ApiKeyDisplay";
import { Card } from "@/components/ui/Card";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { safeJsonParse } from "@/lib/utils";

export default async function ApiKeysPage() {
  const user = await requireUser();

  const keys = await db.apiKey.findMany({
    where: { user_id: user.id },
    orderBy: { created_at: "desc" }
  });

  const apiKeys = keys.map((key) => ({
    id: key.id,
    type: key.type as "roblox" | "polaris",
    name: key.name,
    key_prefix: key.key_prefix,
    scopes: safeJsonParse<string[]>(key.scopes_json ?? "[]", []),
    is_active: key.is_active,
    usage_count: key.usage_count,
    last_used: key.last_used?.toISOString() ?? null,
    created_at: key.created_at.toISOString(),
    expires_at: key.expires_at?.toISOString() ?? null
  }));

  return (
    <>
      <Header
        title="API credentials"
        description="Store encrypted Roblox keys, generate Polaris keys, and monitor credential health."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <ApiKeyDisplay apiKeys={apiKeys} />
        <Card className="dashboard-card">
          <p className="text-xs uppercase tracking-[0.26em] text-slate-500">Shortcuts</p>
          <div className="mt-5 space-y-4">
            <Link
              href="/dashboard/api-keys/roblox"
              className="block rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 text-sm font-semibold text-white hover:bg-white/[0.06]"
            >
              Upload Roblox key
            </Link>
            <Link
              href="/dashboard/api-keys/polaris"
              className="block rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 text-sm font-semibold text-white hover:bg-white/[0.06]"
            >
              Generate Polaris key
            </Link>
          </div>
        </Card>
      </div>
    </>
  );
}
