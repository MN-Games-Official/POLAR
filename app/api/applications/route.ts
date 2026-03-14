import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/api-response";
import { applicationSchema } from "@/lib/validation";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return errorResponse("Unauthorized.", 401, "UNAUTHORIZED");
  }

  const applications = await db.application.findMany({
    where: { user_id: user.id },
    include: {
      _count: { select: { submissions: true } },
      submissions: { select: { passed: true } }
    },
    orderBy: { updated_at: "desc" }
  });

  const mapped = applications.map((application) => ({
    id: application.id,
    name: application.name,
    description: application.description,
    group_id: application.group_id,
    created_at: application.created_at.toISOString(),
    updated_at: application.updated_at.toISOString(),
    submission_count: application._count.submissions,
    pass_count: application.submissions.filter((submission) => submission.passed).length
  }));

  const submissions = mapped.reduce((sum, item) => sum + item.submission_count, 0);
  const passes = mapped.reduce((sum, item) => sum + item.pass_count, 0);

  return successResponse({
    applications: mapped,
    stats: {
      total: mapped.length,
      submissions,
      passRate: submissions ? (passes / submissions) * 100 : 0
    }
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return errorResponse("Unauthorized.", 401, "UNAUTHORIZED");
  }

  try {
    const body = await request.json();
    const parsed = applicationSchema.parse(body);

    const application = await db.application.create({
      data: {
        user_id: user.id,
        name: parsed.name,
        description: parsed.description || null,
        group_id: parsed.group_id,
        target_role: parsed.target_role,
        pass_score: parsed.pass_score,
        primary_color: parsed.style.primary_color,
        secondary_color: parsed.style.secondary_color,
        questions_json: JSON.stringify(parsed.questions),
        style_json: JSON.stringify(parsed.style)
      }
    });

    return successResponse({ application }, { status: 201 });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Unable to create application.",
      400,
      "APPLICATION_CREATE_ERROR"
    );
  }
}
