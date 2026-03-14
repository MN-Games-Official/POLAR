import { addSeconds } from "date-fns";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateApiKey, hashValue } from "@/lib/crypto";
import { errorResponse, successResponse } from "@/lib/api-response";
import { polarisKeySchema } from "@/lib/validation";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return errorResponse("Unauthorized.", 401, "UNAUTHORIZED");
  }

  try {
    const body = await request.json();
    const parsed = polarisKeySchema.parse(body);
    const id = typeof body?.id === "number" ? body.id : undefined;

    if (id) {
      await db.apiKey.updateMany({
        where: { id, user_id: user.id },
        data: { is_active: false }
      });
    }

    const apiKey = generateApiKey("polaris");

    await db.apiKey.create({
      data: {
        user_id: user.id,
        type: "polaris",
        name: parsed.name,
        encrypted_key: hashValue(apiKey),
        key_prefix: `${apiKey.slice(0, 14)}...`,
        scopes_json: JSON.stringify(parsed.scopes),
        expires_at: addSeconds(new Date(), parsed.expires_in),
        is_active: true
      }
    });

    return successResponse({ api_key: apiKey, preview: `${apiKey.slice(0, 14)}...` });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Unable to regenerate key.",
      400,
      "POLARIS_KEY_REGENERATE_ERROR"
    );
  }
}
