import type { ReactNode } from "react";
import { Navigation } from "@/components/Navigation";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="hero-grid min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col gap-8">
        <Navigation />
        <div className="grid flex-1 gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="glass-panel relative overflow-hidden rounded-[2rem] p-8 md:p-12">
            <div className="absolute inset-0 bg-mesh-gradient opacity-80" />
            <div className="hero-grid absolute inset-0 opacity-30" />
            <div className="relative z-10 max-w-2xl">
              <p className="text-xs uppercase tracking-[0.36em] text-mint">Internal Operations</p>
              <h1 className="mt-6 text-5xl font-semibold leading-none md:text-7xl">
                Design Roblox staffing systems with a console that looks as serious as it behaves.
              </h1>
              <p className="mt-6 max-w-xl text-base text-slate-300">
                Polaris Pilot unifies application builders, rank storefronts, secure API key
                handling, and operator account management in one deployment-ready portal.
              </p>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  ["Application Center", "AI-assisted builders and live previews"],
                  ["Rank Center", "Gamepass-aware rank configuration"],
                  ["Security", "JWT auth, encrypted keys, and audit-friendly flows"]
                ].map(([title, body], index) => (
                  <div
                    key={title}
                    className="rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-5 backdrop-blur-sm"
                    style={{ animationDelay: `${index * 120}ms` }}
                  >
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="mt-2 text-sm text-slate-400">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="flex items-center">{children}</section>
        </div>
      </div>
    </main>
  );
}
