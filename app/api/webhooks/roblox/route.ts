import { logger } from "@/lib/logger";
import { successResponse } from "@/lib/api-response";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  logger.info("Received Roblox webhook", payload);
  return successResponse({ message: "Webhook received." });
}
