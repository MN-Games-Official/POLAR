import { db } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return errorResponse("Verification token is required.", 400, "MISSING_TOKEN");
  }

  const record = await db.emailVerification.findUnique({ where: { token } });

  if (!record || record.used || record.expires_at < new Date()) {
    return errorResponse("Verification token is invalid or expired.", 400, "INVALID_TOKEN");
  }

  await db.$transaction([
    db.emailVerification.update({
      where: { token },
      data: { used: true }
    }),
    db.user.update({
      where: { id: record.user_id },
      data: {
        email_verified: true,
        email_verified_at: new Date()
      }
    })
  ]);

  return successResponse({ message: "Email verified." });
}
