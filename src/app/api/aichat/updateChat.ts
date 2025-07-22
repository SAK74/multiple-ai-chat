import { db } from "@/src/lib/prisma";
import type { Message } from "ai";

export async function updateChat(
  userId: string,
  chatId: string,
  ...messages: (Message & { revisionId?: string })[]
) {
  try {
    await db.user.findUniqueOrThrow({ where: { id: userId } });
  } catch (err) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      err.code === "P2025"
    ) {
      throw Error("User not existed in db! Please try log in again.");
    }

    throw Error("Error fetching DB...");
  }
  const prismaMessages = messages.map((message) => {
    delete message.toolInvocations;
    delete message.revisionId;
    return {
      ...message,
      parts: message.parts ? JSON.parse(JSON.stringify(message.parts)) : null,
    };
  });

  await db.chat.upsert({
    where: { id: chatId, userId: userId },
    create: {
      id: chatId,
      messages: { createMany: { data: prismaMessages } },
      userId,
      name: messages[1].content
        .replace(/^[- ]/gm, "")
        .replace(/\n/g, " ")
        .slice(0, 30),
    },
    update: {
      messages: { createMany: { data: prismaMessages, skipDuplicates: true } },
    },
  });
}
