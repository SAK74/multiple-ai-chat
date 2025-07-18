import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma as prismaInstance } from "@/src/lib/prisma";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  ...authConfig,
  // callbacks: {
  //   session(params) {
  //     const { newSession, session } = params;
  //     console.log({ params });

  //     return newSession;
  //   },
  // },
  // events: {
  //   session(message) {
  //     console.log({ message });
  //   },
  //   createUser(message) {
  //     console.log("Create user ", message);
  //   },
  // },
  adapter: PrismaAdapter(prismaInstance),
  session: { strategy: "jwt" },
});
