import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};

const { auth } = NextAuth(authConfig);

export default auth;
