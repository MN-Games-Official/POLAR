import { getCurrentUser } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/api-response";
import { aiGenerationSchema } from "@/lib/validation";
import { generateApplicationWithAi } from "@/lib/abacus";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Unauthorized.", 401, "UNAUTHORIZED");

  try {
    const body = await request.json();
    const parsed = aiGenerationSchema.parse(body);
    const form = await generateApplicationWithAi(parsed);
    return successResponse({ form, application_id: params.id });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "AI generation failed.",
      400,
      "AI_GENERATION_ERROR"
    );
  }
}
