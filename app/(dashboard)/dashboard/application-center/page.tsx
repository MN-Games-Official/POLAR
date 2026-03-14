import { Header } from "@/components/Header";
import { ApplicationList } from "@/components/applications/ApplicationList";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function ApplicationCenterPage() {
  const user = await requireUser();

  const applications = await db.application.findMany({
    where: { user_id: user.id },
    include: {
      _count: {
        select: { submissions: true }
      },
      submissions: {
        select: { passed: true }
      }
    },
    orderBy: { updated_at: "desc" }
  });

  const list = applications.map((application) => ({
    id: application.id,
    name: application.name,
    description: application.description,
    group_id: application.group_id,
    created_at: application.created_at.toISOString(),
    updated_at: application.updated_at.toISOString(),
    submission_count: application._count.submissions,
    pass_count: application.submissions.filter((submission) => submission.passed).length
  }));

  const totalSubmissions = list.reduce((sum, item) => sum + item.submission_count, 0);
  const totalPasses = list.reduce((sum, item) => sum + item.pass_count, 0);

  return (
    <>
      <Header
        title="Application Center"
        description="Build, refine, and deploy Roblox application flows with live preview and AI-assisted generation."
      />
      <ApplicationList
        applications={list}
        stats={{
          total: list.length,
          submissions: totalSubmissions,
          passRate: totalSubmissions ? (totalPasses / totalSubmissions) * 100 : 0
        }}
      />
    </>
  );
}
