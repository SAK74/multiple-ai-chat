import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/src/lib/prisma";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
} = NextAuth({
  ...authConfig,
  callbacks: {
    session(params) {
      const {
        session,
        token: { sub },
      } = params;
      // console.log(styleText("red", "-------------"));
      // console.log("Session callback");
      // console.log({ params, user: session.user });
      // console.log(styleText("red", "-------------"));
      return { ...session, user: { ...session.user, id: sub } };
    },
  },
  events: {},
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
});
