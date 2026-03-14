import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/api-response";
import { safeJsonParse } from "@/lib/utils";
import { z } from "zod";
import type { Question } from "@/types";

const importSchema = z.object({
  mode: z.enum(["replace", "merge"]),
  questions: z.array(z.any())
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Unauthorized.", 401, "UNAUTHORIZED");

  const application = await db.application.findFirst({
    where: { id: params.id, user_id: user.id }
  });

  if (!application) {
    return errorResponse("Application not found.", 404, "APPLICATION_NOT_FOUND");
  }

  try {
    const body = await request.json();
    const parsed = importSchema.parse(body);
    const existing = safeJsonParse<Question[]>(application.questions_json, []);
    const questions =
      parsed.mode === "replace" ? (parsed.questions as Question[]) : [...existing, ...(parsed.questions as Question[])];

    const updated = await db.application.update({
      where: { id: params.id },
      data: { questions_json: JSON.stringify(questions) }
    });

    return successResponse({ application: updated });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Unable to import questions.",
      400,
      "APPLICATION_IMPORT_ERROR"
    );
  }
}
