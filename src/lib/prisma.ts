import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

declare global {
  var prisma: // | PrismaClient
  ReturnType<typeof createClientWithAcceleration> | undefined;
}

const createClientWithAcceleration = () =>
  new PrismaClient().$extends(withAccelerate());

export const db = globalThis.prisma ?? createClientWithAcceleration();
// export const db = globalThis.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}
