import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/api-response";
import { profileUpdateSchema } from "@/lib/validation";

export async function PUT(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return errorResponse("Unauthorized.", 401, "UNAUTHORIZED");
  }

  try {
    const body = await request.json();
    const parsed = profileUpdateSchema.parse(body);

    const updated = await db.user.update({
      where: { id: user.id },
      data: {
        full_name: parsed.full_name || null,
        avatar_url: parsed.avatar_url || null
      },
      select: {
        id: true,
        email: true,
        username: true,
        full_name: true,
        avatar_url: true,
        email_verified: true
      }
    });

    return successResponse({ user: updated, message: "Profile updated." });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Unable to update profile.",
      400,
      "PROFILE_UPDATE_ERROR"
    );
  }
}
