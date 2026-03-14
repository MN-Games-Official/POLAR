import Link from "next/link";
import { KeyRound, PlusCircle, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import { Card } from "@/components/ui/Card";

const actions = [
  {
    href: "/dashboard/application-center/new",
    title: "New application",
    body: "Launch the builder and compose or AI-generate a staffing flow.",
    icon: Sparkles
  },
  {
    href: "/dashboard/rank-center/new",
    title: "New rank center",
    body: "Configure storefront-ready ranks with pricing and gamepass data.",
    icon: Trophy
  },
  {
    href: "/dashboard/api-keys/roblox",
    title: "Upload Roblox key",
    body: "Validate your cloud key and unlock group membership operations.",
    icon: KeyRound
  },
  {
    href: "/dashboard/profile",
    title: "Review profile",
    body: "Update identity, avatar, and password settings for operators.",
    icon: ShieldCheck
  }
];

export function QuickActions() {
  return (
    <Card className="dashboard-card">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-slate-500">Quick actions</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Move the system forward</h3>
        </div>
        <PlusCircle className="h-5 w-5 text-coral" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="shine-border rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-1"
            >
              <Icon className="h-5 w-5 text-mint" />
              <p className="mt-4 text-sm font-semibold text-white">{action.title}</p>
              <p className="mt-2 text-sm text-slate-400">{action.body}</p>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
