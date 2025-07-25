"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { db } from "../lib/prisma";

export const getUsersChats = async (userId: string) =>
  unstable_cache(
    (userId: string) =>
      db.chat.findMany({
        include: { messages: true },
        where: { userId },
        orderBy: { created: "desc" },
      }),
    [userId],
    { tags: ["chats"] }
  );

export async function revalidateChats() {
  revalidateTag("chats");
}
