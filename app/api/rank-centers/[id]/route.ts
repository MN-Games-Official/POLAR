import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/api-response";
import { safeJsonParse } from "@/lib/utils";
import { rankCenterSchema } from "@/lib/validation";
import type { RankEntry } from "@/types";

async function findRankCenter(id: string, userId: number) {
  return db.rankCenter.findFirst({
    where: { id, user_id: userId }
  });
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Unauthorized.", 401, "UNAUTHORIZED");

  const rankCenter = await findRankCenter(params.id, user.id);

  if (!rankCenter) {
    return errorResponse("Rank center not found.", 404, "RANK_CENTER_NOT_FOUND");
  }

  return successResponse({
    rank_center: {
      ...rankCenter,
      ranks: safeJsonParse<RankEntry[]>(rankCenter.ranks_json, [])
    }
  });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Unauthorized.", 401, "UNAUTHORIZED");

  const existing = await findRankCenter(params.id, user.id);
  if (!existing) return errorResponse("Rank center not found.", 404, "RANK_CENTER_NOT_FOUND");

  try {
    const body = await request.json();
    const parsed = rankCenterSchema.parse(body);

    const rankCenter = await db.rankCenter.update({
      where: { id: params.id },
      data: {
        name: parsed.name,
        group_id: parsed.group_id,
        universe_id: parsed.universe_id || null,
        ranks_json: JSON.stringify(parsed.ranks)
      }
    });

    return successResponse({ rank_center: rankCenter });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Unable to update rank center.",
      400,
      "RANK_CENTER_UPDATE_ERROR"
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) return errorResponse("Unauthorized.", 401, "UNAUTHORIZED");

  const existing = await findRankCenter(params.id, user.id);
  if (!existing) return errorResponse("Rank center not found.", 404, "RANK_CENTER_NOT_FOUND");

  await db.rankCenter.delete({ where: { id: params.id } });

  return successResponse({ message: "Rank center deleted." });
}
