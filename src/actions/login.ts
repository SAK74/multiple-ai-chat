"use server";

import { signIn } from "../auth";

export async function login(data: FormData) {
  const email = data.get("email");
  //   console.log({ email });
  await signIn("credentials", { email, redirectTo: "/" });
}
