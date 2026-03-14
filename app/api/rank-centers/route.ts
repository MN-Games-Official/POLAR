import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/api-response";
import { safeJsonParse } from "@/lib/utils";
import { rankCenterSchema } from "@/lib/validation";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return errorResponse("Unauthorized.", 401, "UNAUTHORIZED");
  }

  const rankCenters = await db.rankCenter.findMany({
    where: { user_id: user.id },
    orderBy: { updated_at: "desc" }
  });

  return successResponse({
    rank_centers: rankCenters.map((center) => ({
      id: center.id,
      name: center.name,
      group_id: center.group_id,
      universe_id: center.universe_id,
      rank_count: safeJsonParse<unknown[]>(center.ranks_json, []).length,
      created_at: center.created_at.toISOString(),
      updated_at: center.updated_at.toISOString()
    }))
  });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return errorResponse("Unauthorized.", 401, "UNAUTHORIZED");
  }

  try {
    const body = await request.json();
    const parsed = rankCenterSchema.parse(body);

    const rankCenter = await db.rankCenter.create({
      data: {
        user_id: user.id,
        name: parsed.name,
        group_id: parsed.group_id,
        universe_id: parsed.universe_id || null,
        ranks_json: JSON.stringify(parsed.ranks)
      }
    });

    return successResponse({ rank_center: rankCenter }, { status: 201 });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Unable to create rank center.",
      400,
      "RANK_CENTER_CREATE_ERROR"
    );
  }
}
