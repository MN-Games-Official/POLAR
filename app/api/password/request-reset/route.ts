import { db } from "@/lib/db";
import { successResponse, errorResponse } from "@/lib/api-response";
import { sendMail } from "@/lib/mail";
import { forgotPasswordSchema } from "@/lib/validation";
import { randomToken, withAbsoluteUrl } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.parse(body);

    const user = await db.user.findUnique({ where: { email: parsed.email } });

    if (user) {
      const token = randomToken(48);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await db.passwordReset.create({
        data: {
          user_id: user.id,
          token,
          expires_at: expiresAt
        }
      });

      const resetUrl = withAbsoluteUrl(`/reset-password?token=${encodeURIComponent(token)}`);
      await sendMail({
        to: user.email,
        subject: "Reset your Polaris Pilot password",
        html: `<p>Reset your password by visiting <a href="${resetUrl}">${resetUrl}</a>.</p>`
      });
    }

    return successResponse({ message: "If the email exists, a reset link has been sent." });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Unable to request reset.",
      400,
      "PASSWORD_RESET_REQUEST_ERROR"
    );
  }
}
