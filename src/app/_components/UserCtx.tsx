"use client";

import type { User } from "next-auth";
import { createContext, use } from "react";

export const UserContext = createContext<{
  user?: User;
} | null>(null);

export const useUser = () => {
  const ctx = use(UserContext);
  if (!ctx) {
    throw Error("Component beyond User context");
  }
  return ctx;
};
