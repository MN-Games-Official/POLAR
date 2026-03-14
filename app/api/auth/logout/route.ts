import { clearAuthCookies, getRefreshTokenFromCookies, revokeRefreshToken } from "@/lib/auth";
import { successResponse } from "@/lib/api-response";

export async function POST() {
  const refreshToken = getRefreshTokenFromCookies();
  await revokeRefreshToken(refreshToken);
  clearAuthCookies();
  return successResponse({ message: "Signed out." });
}
