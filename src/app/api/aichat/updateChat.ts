import { compressFRomDataUrl } from "@/src/actions/compress";
import { db } from "@/src/lib/prisma";
import type { Message } from "ai";

export async function updateChat(
  userId: string,
  chatId: string,
  ...messages: (Message & { revisionId?: string; chatId?: string })[]
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
    delete message.chatId;
    return {
      ...message,
      parts: message.parts ? JSON.parse(JSON.stringify(message.parts)) : null,
    };
  });

  const compressedMessages = await Promise.all(
    prismaMessages.map(async (mess) => {
      if (mess.experimental_attachments) {
        const compressedAttachments = await Promise.all(
          mess.experimental_attachments.map(async (att) => {
            const { url, contentType } = await compressFRomDataUrl(att.url);
            return {
              ...att,
              url,
              contentType,
            };
          })
        );
        return { ...mess, experimental_attachments: compressedAttachments };
      }
      return mess;
    })
  );

  await db.chat.upsert({
    where: { id: chatId, userId: userId },
    create: {
      id: chatId,
      messages: { createMany: { data: compressedMessages } },
      userId,
      name: messages[1].content
        .replace(/^[- ]/gm, "")
        .replace(/\n/g, " ")
        .slice(0, 30),
    },
    update: {
      messages: {
        createMany: { data: compressedMessages, skipDuplicates: true },
      },
    },
  });
}
