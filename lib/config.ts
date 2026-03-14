import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1).optional(),
  JWT_SECRET: z.string().min(32).default("replace-with-a-jwt-secret-of-32-chars-or-more"),
  JWT_EXPIRES_IN: z.string().default("24h"),
  REFRESH_TOKEN_EXPIRES_DAYS: z.coerce.number().default(30),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_API_BASE: z.string().default("/api"),
  ROBLOX_API_BASE: z.string().url().default("https://apis.roblox.com"),
  ROBLOX_GROUP_API: z.string().url().default("https://groups.roblox.com"),
  ROBLOX_SAMPLE_GROUP_ID: z.string().default("123456"),
  SMTP_HOST: z.string().default("smtp.example.com"),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().default("noreply@example.com"),
  SMTP_PASS: z.string().default("password"),
  SMTP_FROM_EMAIL: z.string().default("noreply@example.com"),
  SMTP_FROM_NAME: z.string().default("Polaris Pilot"),
  ABACUS_AI_API_KEY: z.string().optional(),
  ABACUS_AI_BASE_URL: z.string().url().default("https://routellm.abacus.ai/v1"),
  ABACUS_AI_MODEL: z.string().default("gemini-3-flash-preview"),
  ENCRYPTION_KEY: z.string().min(32).default("replace-with-encryption-key-32-chars-minimum")
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.warn("Environment validation failed", parsed.error.flatten().fieldErrors);
}

const env = parsed.success ? parsed.data : envSchema.parse({});

export const config = {
  environment: process.env.NODE_ENV ?? "development",
  apiUrl: env.NEXT_PUBLIC_API_BASE,
  appUrl: env.NEXT_PUBLIC_APP_URL,
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshDays: env.REFRESH_TOKEN_EXPIRES_DAYS
  },
  roblox: {
    cloudBase: env.ROBLOX_API_BASE,
    groupsBase: env.ROBLOX_GROUP_API,
    sampleGroupId: env.ROBLOX_SAMPLE_GROUP_ID
  },
  smtp: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    fromEmail: env.SMTP_FROM_EMAIL,
    fromName: env.SMTP_FROM_NAME
  },
  abacus: {
    apiKey: env.ABACUS_AI_API_KEY,
    baseUrl: env.ABACUS_AI_BASE_URL,
    model: env.ABACUS_AI_MODEL
  },
  encryptionKey: env.ENCRYPTION_KEY
};
