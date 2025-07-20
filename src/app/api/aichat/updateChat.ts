import { db } from "@/src/lib/prisma";
import type { Message } from "ai";
import { styleText } from "node:util";

export async function updateChat(
  userId: string,
  chatId: string,
  ...messages: Message[]
) {
  console.log(styleText("green", "In update chat: "), userId, chatId, messages);

  const prismaMessages = messages.map((message) => {
    delete message.toolInvocations;
    return {
      ...message,
      parts: message.parts ? JSON.parse(JSON.stringify(message.parts)) : null,
    };
  });

  await db.user.update({
    where: { id: userId },
    data: {
      chats: {
        upsert: {
          where: { id: chatId },
          create: {
            messages: { createMany: { data: prismaMessages } },
          },
          update: { messages: { createMany: { data: prismaMessages } } },
        },
      },
    },
  });
}
