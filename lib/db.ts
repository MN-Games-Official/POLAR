import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaClient = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"]
});

export const db = global.prisma || prismaClient;

if (process.env.NODE_ENV !== "production") {
  global.prisma = db;
}
