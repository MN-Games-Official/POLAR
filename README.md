# Polaris Pilot

Polaris Pilot is an internal admin portal built with Next.js 14, React 18, TypeScript, Tailwind CSS, Prisma, and MySQL. It is designed for Polaris operators managing application builders, rank centers, API credentials, and operator accounts.

## Included

- JWT auth with httpOnly cookies and refresh tokens
- Sign up, login, logout, email verification, forgot password, reset password
- Dashboard overview with activity, stats, and quick actions
- Application Center builder with live preview and Abacus AI generation
- Rank Center builder with editable rank catalog and preview
- Roblox key upload and validation with encrypted storage
- Polaris API key generation with hashed storage
- Profile editing and password rotation
- Submission grading and Roblox promotion workflow
- Prisma schema for MySQL and Vercel-ready configuration

## Stack

- Next.js 14 App Router
- React 18
- TypeScript strict mode
- Tailwind CSS 3
- Prisma 5 + MySQL
- React Hook Form + Zod
- Nodemailer
- jsonwebtoken + bcryptjs

## Local setup

```bash
npm install
cp .env.example .env.local
npm run build
```

Update `.env.local` with real values before using auth, database, email, Roblox, or Abacus AI features.

## Environment variables

See [`/.env.example`](/C:/Users/sarai/OneDrive/POLARIS%20CONFIDENTIAL/.env.example) for the full list. The required categories are:

- `DATABASE_URL`
- `JWT_SECRET`
- `REFRESH_TOKEN_EXPIRES_DAYS`
- `SMTP_*`
- `ROBLOX_*`
- `ABACUS_AI_*`
- `ENCRYPTION_KEY`
- `NEXT_PUBLIC_*`

## Database

Generate and apply Prisma changes:

```bash
npm run prisma:generate
npm run prisma:migrate
```

Schema lives in [`/prisma/schema.prisma`](/C:/Users/sarai/OneDrive/POLARIS%20CONFIDENTIAL/prisma/schema.prisma).

## Important routes

- `/login`
- `/signup`
- `/dashboard`
- `/dashboard/application-center`
- `/dashboard/rank-center`
- `/dashboard/api-keys`
- `/dashboard/profile`

API routes are under `/api/*`.

## Deployment

The project is scaffolded for Vercel:

1. Create a Vercel project from this repo.
2. Add the variables from `.env.example` in Vercel project settings.
3. Point `DATABASE_URL` at the production MySQL instance.
4. Run Prisma migrations against production before first use.
5. Deploy with `npm run build`.

Config files:

- [`/vercel.json`](/C:/Users/sarai/OneDrive/POLARIS%20CONFIDENTIAL/vercel.json)
- [`/next.config.mjs`](/C:/Users/sarai/OneDrive/POLARIS%20CONFIDENTIAL/next.config.mjs)
- [`/middleware.ts`](/C:/Users/sarai/OneDrive/POLARIS%20CONFIDENTIAL/middleware.ts)

## Verification

Production build completed successfully with:

```bash
npm run build
```
