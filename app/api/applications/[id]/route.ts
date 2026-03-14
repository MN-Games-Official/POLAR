import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/api-response";
import { safeJsonParse } from "@/lib/utils";
import { applicationSchema } from "@/lib/validation";
import type { Question } from "@/types";

async function findApplication(id: string, userId: number) {
  return db.application.findFirst({
    where: { id, user_id: userId }
  });
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Unauthorized.", 401, "UNAUTHORIZED");

  const application = await findApplication(params.id, user.id);

  if (!application) {
    return errorResponse("Application not found.", 404, "APPLICATION_NOT_FOUND");
  }

  return successResponse({
    application: {
      ...application,
      questions: safeJsonParse<Question[]>(application.questions_json, []),
      style: safeJsonParse<Record<string, string>>(application.style_json ?? "{}", {
        primary_color: application.primary_color,
        secondary_color: application.secondary_color
      })
    }
  });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Unauthorized.", 401, "UNAUTHORIZED");

  const existing = await findApplication(params.id, user.id);

  if (!existing) {
    return errorResponse("Application not found.", 404, "APPLICATION_NOT_FOUND");
  }

  try {
    const body = await request.json();
    const parsed = applicationSchema.parse(body);

    const application = await db.application.update({
      where: { id: params.id },
      data: {
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

    return successResponse({ application });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Unable to update application.",
      400,
      "APPLICATION_UPDATE_ERROR"
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Unauthorized.", 401, "UNAUTHORIZED");

  const existing = await findApplication(params.id, user.id);

  if (!existing) {
    return errorResponse("Application not found.", 404, "APPLICATION_NOT_FOUND");
  }

  await db.application.delete({ where: { id: params.id } });

  return successResponse({ message: "Application deleted." });
}
