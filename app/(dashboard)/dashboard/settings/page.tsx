import { Header } from "@/components/Header";
import { Card } from "@/components/ui/Card";

export default function SettingsPage() {
  return (
    <>
      <Header
        title="System settings"
        description="Reserved space for deployment, environment, and policy settings."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="dashboard-card">
          <p className="text-xs uppercase tracking-[0.26em] text-slate-500">Deployment posture</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Vercel configuration</h3>
          <p className="mt-4 text-sm text-slate-400">
            The project is scaffolded for Vercel with Prisma, MySQL, environment-variable based
            secret handling, and protected route middleware.
          </p>
        </Card>
        <Card className="dashboard-card">
          <p className="text-xs uppercase tracking-[0.26em] text-slate-500">Security posture</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Operational hardening</h3>
          <p className="mt-4 text-sm text-slate-400">
            Input validation, encrypted Roblox keys, hashed Polaris keys, JWT cookies, refresh
            token rotation, and security headers are built into the foundation.
          </p>
        </Card>
      </div>
    </>
  );
}
