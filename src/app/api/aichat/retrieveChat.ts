import { db } from "@/src/lib/prisma";

export async function retrieveChatMessages(chatId: string, userId: string) {
  return (
    await db.chat.findUnique({
      where: { id: chatId, userId },
      select: { messages: true },
    })
  )?.messages;
}
