import type { NextAuthConfig } from "next-auth";
import github from "next-auth/providers/github";
import credentials from "next-auth/providers/credentials";
import { db } from "./lib/prisma";

export const authConfig = {
  basePath: "/api/nextauth",
  providers: [
    github,
    credentials({
      async authorize(credentials) {
        const { email } = credentials as { email: string };
        let userInDb = await db.user.findUnique({
          where: { email },
        });
        if (!userInDb) {
          userInDb = await db.user.create({ data: { email } });
        }
        return userInDb;
      },
    }),
  ],
} satisfies NextAuthConfig;
