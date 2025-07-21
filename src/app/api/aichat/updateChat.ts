import { db } from "@/src/lib/prisma";
import type { Message } from "ai";
import { styleText } from "node:util";

export async function updateChat(
  userId: string,
  chatId: string,
  ...messages: Message[]
) {
  console.log(styleText("green", "In update chat: "), userId, chatId, messages);
  try {
    await db.user.findUniqueOrThrow({ where: { id: userId } });
  } catch (err) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as any).code === "P2025"
    ) {
      throw Error("User not existed in db! Please try log in again.");
    }

    throw Error("Error fetching DB...");
  }
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
            name: messages[1].content.slice(0, 30),
          },
          update: { messages: { createMany: { data: prismaMessages } } },
        },
      },
    },
  });
}
