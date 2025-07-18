import type { Message } from "ai";
import { prisma } from "@/src/lib/prisma";

export async function updateChat(
  userId: string,
  chatId: string,
  ...messages: Message[]
) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      chats: {
        upsert: {
          where: { id: chatId },
          create: { messages: { createMany: { data: messages } } },
          update: { messages: { createMany: { data: messages } } },
        },
      },
    },
  });
}
