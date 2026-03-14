import { db } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/api-response";
import { setAuthCookies, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.parse(body);

    const user = await db.user.findUnique({
      where: { email: parsed.email }
    });

    if (!user) {
      return errorResponse("Invalid credentials.", 401, "INVALID_CREDENTIALS");
    }

    const valid = await verifyPassword(parsed.password, user.password_hash);

    if (!valid) {
      return errorResponse("Invalid credentials.", 401, "INVALID_CREDENTIALS");
    }

    if (!user.email_verified) {
      return errorResponse("Please verify your email before signing in.", 403, "EMAIL_NOT_VERIFIED");
    }

    const { accessToken } = await setAuthCookies(user);

    return successResponse({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        full_name: user.full_name,
        avatar_url: user.avatar_url
      },
      access_token: accessToken
    });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Unable to sign in.",
      400,
      "LOGIN_ERROR"
    );
  }
}
