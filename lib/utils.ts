import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function randomToken(length = 48) {
  const alphabet =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return Array.from({ length })
    .map(() => alphabet[Math.floor(Math.random() * alphabet.length)])
    .join("");
}

export function withAbsoluteUrl(pathname: string) {
  return new URL(pathname, process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").toString();
}
