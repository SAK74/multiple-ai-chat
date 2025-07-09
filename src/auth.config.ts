import type { NextAuthConfig } from "next-auth";
import github from "next-auth/providers/github";

export const authConfig = {
  basePath: "/api/nextauth",
  providers: [github],
  callbacks: {
    authorized({ auth }) {
      console.log({ auth });

      return !!auth;
    },
  },
} satisfies NextAuthConfig;
