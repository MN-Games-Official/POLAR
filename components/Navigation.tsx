import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export function Navigation() {
  return (
    <nav className="glass-panel rounded-full border border-white/10 px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-coral to-sun text-lg font-semibold text-slate-950 shadow-glow">
            P
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-mint">
              Polaris
            </p>
            <p className="text-sm text-white">{APP_NAME}</p>
          </div>
        </Link>
        <div className="hidden items-center gap-3 md:flex">
          <Link className="text-sm text-slate-300 hover:text-white" href="/login">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="shine-border inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-coral to-sun px-5 text-sm font-medium text-slate-950 shadow-glow transition-all duration-300 hover:brightness-105"
          >
            Create account
          </Link>
        </div>
      </div>
    </nav>
  );
}
