import { Header } from "@/components/Header";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireUser();

  const [applicationCount, rankCenterCount, recentSubmissions, apiKeys, submissionStats] =
    await Promise.all([
      db.application.count({ where: { user_id: user.id } }),
      db.rankCenter.count({ where: { user_id: user.id } }),
      db.applicationSubmission.findMany({
        where: { application: { user_id: user.id } },
        orderBy: { submitted_at: "desc" },
        take: 5,
        include: {
          application: {
            select: { name: true }
          }
        }
      }),
      db.apiKey.findMany({
        where: { user_id: user.id, is_active: true },
        orderBy: { created_at: "desc" },
        take: 5
      }),
      db.applicationSubmission.aggregate({
        where: { application: { user_id: user.id } },
        _count: { id: true },
        _avg: { score: true, max_score: true }
      })
    ]);

  const passRate =
    submissionStats._avg.score && submissionStats._avg.max_score
      ? Math.round((submissionStats._avg.score / submissionStats._avg.max_score) * 100)
      : 0;

  const activity = recentSubmissions.map((submission) => ({
    id: submission.id,
    title: `${submission.application.name} submitted`,
    description: `${submission.roblox_user_id} scored ${Math.round(
      (submission.score / submission.max_score) * 100
    )}% and ${submission.passed ? "passed" : "did not pass"}.`,
    timestamp: submission.submitted_at.toISOString()
  }));

  if (!activity.length && apiKeys.length) {
    activity.push(
      ...apiKeys.map((apiKey) => ({
        id: `key-${apiKey.id}`,
        title: `${apiKey.type.toUpperCase()} key active`,
        description: `Credential ${apiKey.key_prefix} is available for operator workflows.`,
        timestamp: apiKey.created_at.toISOString()
      }))
    );
  }

  return (
    <>
      <Header
        title="Operational dashboard"
        description="Monitor application performance, key readiness, and recent promotion activity from one control surface."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Applications"
          value={String(applicationCount)}
          detail="Configured staffing and assessment flows."
        />
        <StatsCard
          label="Rank centers"
          value={String(rankCenterCount)}
          detail="Storefront or promotion rank programs."
        />
        <StatsCard
          label="Submissions"
          value={String(submissionStats._count.id)}
          detail="Tracked application submissions in the database."
        />
        <StatsCard
          label="Pass rate"
          value={`${passRate}%`}
          detail="Average score outcome across recorded submissions."
        />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ActivityFeed items={activity} />
        <QuickActions />
      </div>
    </>
  );
}
