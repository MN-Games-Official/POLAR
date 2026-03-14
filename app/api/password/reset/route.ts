import { db } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/api-response";
import { hashPassword } from "@/lib/auth";
import { resetPasswordSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.parse(body);

    const resetRecord = await db.passwordReset.findUnique({
      where: { token: parsed.token }
    });

    if (!resetRecord || resetRecord.used || resetRecord.expires_at < new Date()) {
      return errorResponse("Reset token is invalid or expired.", 400, "INVALID_RESET_TOKEN");
    }

    const nextHash = await hashPassword(parsed.new_password);

    await db.$transaction([
      db.user.update({
        where: { id: resetRecord.user_id },
        data: { password_hash: nextHash }
      }),
      db.passwordReset.update({
        where: { token: parsed.token },
        data: { used: true }
      }),
      db.refreshToken.updateMany({
        where: { user_id: resetRecord.user_id, revoked_at: null },
        data: { revoked_at: new Date() }
      })
    ]);

    return successResponse({ message: "Password reset successful." });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Unable to reset password.",
      400,
      "PASSWORD_RESET_ERROR"
    );
  }
}
