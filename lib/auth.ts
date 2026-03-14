import bcrypt from "bcryptjs";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "@prisma/client";
import { db } from "@/lib/db";
import { config } from "@/lib/config";
import { randomToken } from "@/lib/utils";

const ACCESS_COOKIE = "polaris_access";
const REFRESH_COOKIE = "polaris_refresh";

type JwtPayload = {
  sub: number;
  email: string;
  username: string;
};

function cookieBaseOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge
  };
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export function signAccessToken(user: Pick<User, "id" | "email" | "username">) {
  const options: SignOptions = {
    expiresIn: config.jwt.expiresIn as SignOptions["expiresIn"]
  };

  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      username: user.username
    },
    config.jwt.secret as Secret,
    options
  );
}

export function verifyAccessToken(token: string) {
  const decoded = jwt.verify(token, config.jwt.secret as Secret);

  if (typeof decoded === "string") {
    throw new Error("Invalid access token payload.");
  }

  return decoded as unknown as JwtPayload;
}

export async function createRefreshToken(userId: number) {
  const token = randomToken(72);
  const expiresAt = new Date(
    Date.now() + config.jwt.refreshDays * 24 * 60 * 60 * 1000
  );

  await db.refreshToken.create({
    data: {
      user_id: userId,
      token,
      expires_at: expiresAt
    }
  });

  return { token, expiresAt };
}

export async function rotateRefreshToken(token: string) {
  const existing = await db.refreshToken.findUnique({ where: { token } });

  if (!existing || existing.revoked_at || existing.expires_at < new Date()) {
    return null;
  }

  await db.refreshToken.update({
    where: { token },
    data: { revoked_at: new Date() }
  });

  return createRefreshToken(existing.user_id);
}

export async function revokeRefreshToken(token?: string) {
  if (!token) return;

  await db.refreshToken.updateMany({
    where: { token },
    data: { revoked_at: new Date() }
  });
}

export async function setAuthCookies(
  user: Pick<User, "id" | "email" | "username">
) {
  const accessToken = signAccessToken(user);
  const refreshToken = await createRefreshToken(user.id);
  const store = cookies();

  store.set(ACCESS_COOKIE, accessToken, cookieBaseOptions(60 * 60 * 24));
  store.set(
    REFRESH_COOKIE,
    refreshToken.token,
    cookieBaseOptions(config.jwt.refreshDays * 24 * 60 * 60)
  );

  return { accessToken, refreshToken: refreshToken.token };
}

export function clearAuthCookies() {
  const store = cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}

export async function getCurrentUser() {
  try {
    const accessToken = cookies().get(ACCESS_COOKIE)?.value;

    if (!accessToken) return null;

    const decoded = verifyAccessToken(accessToken);

    return db.user.findUnique({
      where: { id: Number(decoded.sub) },
      select: {
        id: true,
        email: true,
        username: true,
        full_name: true,
        avatar_url: true,
        email_verified: true
      }
    });
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export function getRefreshTokenFromCookies() {
  return cookies().get(REFRESH_COOKIE)?.value;
}
