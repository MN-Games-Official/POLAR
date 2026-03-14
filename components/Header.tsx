"use client";

import { Bell, LogOut, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";

export function Header({
  title,
  description
}: {
  title: string;
  description?: string;
}) {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-coral">Polaris Control</p>
        <h1 className="mt-2 text-3xl font-semibold md:text-4xl">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm text-slate-400">{description}</p> : null}
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <label className="relative block min-w-[18rem]">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input className="pl-11" placeholder="Search builders, keys, or users" />
        </label>

        <div className="glass-panel flex items-center gap-4 rounded-full px-4 py-3">
          <button
            aria-label="Notifications"
            className="rounded-full border border-white/10 p-2 text-slate-300 hover:text-white"
            type="button"
          >
            <Bell className="h-4 w-4" />
          </button>
          <div className="text-right">
            <p className="text-sm font-semibold text-white">{user?.full_name || user?.username || "Operator"}</p>
            <p className="text-xs text-slate-500">{user?.email || "Not loaded"}</p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={async () => {
              await logout();
              router.push("/login");
            }}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
