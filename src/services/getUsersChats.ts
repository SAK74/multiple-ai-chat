"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import { db } from "../lib/prisma";

export const getUsersChats = async (userId: string) => {
  const cachedChats = unstable_cache(
    (userId: string) =>
      db.chat.findMany({
        include: { messages: true },
        where: { userId },
        orderBy: { created: "desc" },
      }),
    [userId],
    { tags: ["chats"] },
  );

  const chats = await cachedChats(userId);
  // Restoration Date format of cached chats
  return chats.map((chat) => ({
    ...chat,
    created: new Date(chat.created),
    messages: chat.messages.map((msg) => ({
      ...msg,
      ...(msg.createdAt && { createdAt: new Date(msg.createdAt) }),
    })),
  }));
};

export async function revalidateChats() {
  revalidateTag("chats", "max");
}
