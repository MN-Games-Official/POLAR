import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/api-response";
import { z } from "zod";

const importSchema = z.object({
  ranks: z.array(z.any())
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Unauthorized.", 401, "UNAUTHORIZED");

  const rankCenter = await db.rankCenter.findFirst({
    where: { id: params.id, user_id: user.id }
  });

  if (!rankCenter) {
    return errorResponse("Rank center not found.", 404, "RANK_CENTER_NOT_FOUND");
  }

  try {
    const body = await request.json();
    const parsed = importSchema.parse(body);

    const updated = await db.rankCenter.update({
      where: { id: params.id },
      data: { ranks_json: JSON.stringify(parsed.ranks) }
    });

    return successResponse({ rank_center: updated });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Unable to import ranks.",
      400,
      "RANK_CENTER_IMPORT_ERROR"
    );
  }
}
