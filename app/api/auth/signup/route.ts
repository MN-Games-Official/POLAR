import { db } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/api-response";
import { hashPassword } from "@/lib/auth";
import { sendMail } from "@/lib/mail";
import { logger } from "@/lib/logger";
import { signUpSchema } from "@/lib/validation";
import { randomToken, withAbsoluteUrl } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signUpSchema.parse(body);

    const existing = await db.user.findFirst({
      where: {
        OR: [{ email: parsed.email }, { username: parsed.username }]
      }
    });

    if (existing) {
      return errorResponse("Email or username is already in use.", 409, "DUPLICATE_USER");
    }

    const passwordHash = await hashPassword(parsed.password);
    const token = randomToken(48);
    const expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000);

    const user = await db.user.create({
      data: {
        email: parsed.email,
        username: parsed.username,
        password_hash: passwordHash,
        full_name: parsed.full_name || null,
        emailVerification: {
          create: {
            token,
            expires_at: expiresAt
          }
        }
      }
    });

    const verificationUrl = withAbsoluteUrl(`/verify-email?token=${encodeURIComponent(token)}`);

    try {
      await sendMail({
        to: user.email,
        subject: "Verify your Polaris Pilot email",
        html: `<p>Verify your email by visiting <a href="${verificationUrl}">${verificationUrl}</a>.</p>`
      });
    } catch (error) {
      logger.error("Failed to send verification email", error);
    }

    return successResponse(
      {
        message: "Account created. Please verify your email.",
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        }
      },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Unable to create account.",
      400,
      "SIGNUP_ERROR"
    );
  }
}
