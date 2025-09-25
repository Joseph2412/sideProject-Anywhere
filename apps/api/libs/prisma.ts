import { PrismaClient } from "@repo/database";

const globalPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient =
  globalPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
  });
