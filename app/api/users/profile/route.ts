import { getCurrentUser } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return errorResponse("Unauthorized.", 401, "UNAUTHORIZED");
  }

  return successResponse({ user });
}
