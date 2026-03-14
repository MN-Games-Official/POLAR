import { getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/api-response";
import { changePasswordSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return errorResponse("Unauthorized.", 401, "UNAUTHORIZED");
  }

  try {
    const body = await request.json();
    const parsed = changePasswordSchema.parse(body);

    const fullUser = await db.user.findUnique({ where: { id: user.id } });

    if (!fullUser) {
      return errorResponse("User not found.", 404, "USER_NOT_FOUND");
    }

    const valid = await verifyPassword(parsed.current_password, fullUser.password_hash);

    if (!valid) {
      return errorResponse("Current password is incorrect.", 400, "INVALID_PASSWORD");
    }

    const nextHash = await hashPassword(parsed.new_password);

    await db.$transaction([
      db.user.update({
        where: { id: user.id },
        data: { password_hash: nextHash }
      }),
      db.refreshToken.updateMany({
        where: { user_id: user.id, revoked_at: null },
        data: { revoked_at: new Date() }
      })
    ]);

    return successResponse({ message: "Password updated." });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Unable to change password.",
      400,
      "CHANGE_PASSWORD_ERROR"
    );
  }
}
