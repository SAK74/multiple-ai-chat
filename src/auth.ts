import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/src/lib/prisma";
import { styleText } from "util";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
} = NextAuth({
  ...authConfig,
  callbacks: {
    session(params) {
      const {
        newSession,
        session,
        token: { sub },
      } = params;
      // console.log(styleText("red", "-------------"));
      // console.log("Session callback");
      // console.log({ params, user: session.user });
      // console.log(styleText("red", "-------------"));

      return { ...session, user: { ...session.user, id: sub } };
    },
    // jwt(params) {
    //   // console.log(styleText("red", "-------------"));
    //   // console.log("Jwt callback");
    //   // console.log({ params });
    //   // console.log(styleText("red", "-------------"));
    //   return params.token;
    // },
  },
  events: {
    session(message) {
      // console.log(styleText("red", "-------------"));
      // console.log("Session event");
      // console.log({ message });
      // console.log(styleText("red", "-------------"));
    },

    // createUser(message) {
    //   console.log("Create user ", message);
    // },
    async signIn(message) {
      // console.log(styleText("red", "-------------"));
      // console.log("Signin event");
      // console.log({ message });
      // console.log(styleText("red", "-------------"));
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
});
