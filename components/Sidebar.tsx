"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  KeyRound,
  LayoutDashboard,
  Rocket,
  Settings,
  Shield,
  Trophy,
  UserCircle2
} from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const iconMap = {
  Dashboard: LayoutDashboard,
  "Application Center": Rocket,
  "Rank Center": Trophy,
  "API Keys": KeyRound,
  Profile: UserCircle2,
  Settings: Settings
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-panel sticky top-6 flex h-[calc(100vh-3rem)] flex-col rounded-[2rem] border border-white/10 px-5 py-6">
      <div className="mb-8 flex items-center gap-3">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-coral to-sun text-lg font-semibold text-slate-950 shadow-glow">
          P
        </span>
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-mint">Pilot Console</p>
          <p className="text-sm font-semibold text-white">Admin Operations</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.label as keyof typeof iconMap] ?? Shield;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-200",
                active
                  ? "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-mint" : "text-slate-500")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/8 to-white/0 p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-coral">Deployment ready</p>
        <p className="mt-2 text-sm font-semibold text-white">Vercel-first control plane</p>
        <p className="mt-1 text-xs text-slate-400">
          Built for internal operators managing applications, ranks, and keys.
        </p>
      </div>
    </aside>
  );
}
