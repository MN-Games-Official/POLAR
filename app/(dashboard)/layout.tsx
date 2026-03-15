import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { requireUser } from "@/lib/auth";

export default async function DashboardLayout({
  children
}: {
  children: ReactNode;
}) {
  await requireUser();

  return (
    <div className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto grid max-w-[1600px] gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <Sidebar />
        <main className="min-w-0 rounded-[2rem] border border-white/8 bg-slate-950/20 p-4 md:p-8 overflow-y-auto max-h-[calc(100vh-48px)]">
          {children}
          <Footer />
        </main>
      </div>
    </div>
  );
}
