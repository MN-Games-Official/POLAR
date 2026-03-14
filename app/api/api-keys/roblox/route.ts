import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { encryptValue } from "@/lib/crypto";
import { errorResponse, successResponse } from "@/lib/api-response";
import { RobloxService } from "@/lib/roblox-service";
import { robloxKeySchema } from "@/lib/validation";

function buildPreview(key: string) {
  return `${key.slice(0, 10)}...${key.slice(-4)}`;
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return errorResponse("Unauthorized.", 401, "UNAUTHORIZED");
  }

  try {
    const body = await request.json();
    const parsed = robloxKeySchema.parse(body);

    if (parsed.validate) {
      const service = new RobloxService(parsed.api_key);
      await service.validateKey();
    }

    await db.apiKey.updateMany({
      where: { user_id: user.id, type: "roblox" },
      data: { is_active: false }
    });

    const apiKey = await db.apiKey.create({
      data: {
        user_id: user.id,
        type: "roblox",
        name: "Roblox Cloud Key",
        encrypted_key: encryptValue(parsed.api_key),
        key_prefix: buildPreview(parsed.api_key),
        is_active: true
      }
    });

    return successResponse({
      message: "API key validated and saved.",
      preview: apiKey.key_prefix
    });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Unable to save Roblox API key.",
      400,
      "ROBLOX_KEY_SAVE_ERROR"
    );
  }
}
