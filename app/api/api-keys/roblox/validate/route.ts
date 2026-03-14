import { errorResponse, successResponse } from "@/lib/api-response";
import { RobloxService } from "@/lib/roblox-service";
import { robloxKeySchema } from "@/lib/validation";

function buildPreview(key: string) {
  return `${key.slice(0, 10)}...${key.slice(-4)}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = robloxKeySchema.parse(body);
    const service = new RobloxService(parsed.api_key);

    await service.validateKey();

    return successResponse({
      message: "Roblox API key validated.",
      preview: buildPreview(parsed.api_key)
    });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Roblox API key validation failed.",
      400,
      "ROBLOX_KEY_VALIDATION_ERROR"
    );
  }
}
