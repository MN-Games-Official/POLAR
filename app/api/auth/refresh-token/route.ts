import { db } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/api-response";
import { createRefreshToken, getRefreshTokenFromCookies, revokeRefreshToken, signAccessToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST() {
  const token = getRefreshTokenFromCookies();

  if (!token) {
    return errorResponse("Refresh token missing.", 401, "MISSING_REFRESH_TOKEN");
  }

  const existing = await db.refreshToken.findUnique({ where: { token } });

  if (!existing || existing.revoked_at || existing.expires_at < new Date()) {
    return errorResponse("Refresh token invalid.", 401, "INVALID_REFRESH_TOKEN");
  }

  const user = await db.user.findUnique({ where: { id: existing.user_id } });

  if (!user) {
    return errorResponse("User no longer exists.", 404, "USER_NOT_FOUND");
  }

  await revokeRefreshToken(token);
  const nextRefresh = await createRefreshToken(user.id);
  const accessToken = signAccessToken(user);

  cookies().set("polaris_access", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24
  });
  cookies().set("polaris_refresh", nextRefresh.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });

  return successResponse({ access_token: accessToken });
}
