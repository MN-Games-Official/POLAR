import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/api-response";
import { safeJsonParse } from "@/lib/utils";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return errorResponse("Unauthorized.", 401, "UNAUTHORIZED");
  }

  const keys = await db.apiKey.findMany({
    where: { user_id: user.id },
    orderBy: { created_at: "desc" }
  });

  return successResponse({
    api_keys: keys.map((key) => ({
      id: key.id,
      type: key.type,
      name: key.name,
      key_prefix: key.key_prefix,
      scopes: safeJsonParse<string[]>(key.scopes_json ?? "[]", []),
      is_active: key.is_active,
      usage_count: key.usage_count,
      last_used: key.last_used?.toISOString() ?? null,
      created_at: key.created_at.toISOString(),
      expires_at: key.expires_at?.toISOString() ?? null
    }))
  });
}
