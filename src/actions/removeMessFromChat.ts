"use server";

import { db } from "../lib/prisma";

export async function removMessFromChat(chatId: string, messId: string) {
  await db.message.delete({ where: { id: messId, chatId: chatId } });
}
