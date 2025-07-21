"use server";

import { db } from "../lib/prisma";

export async function removeChatById(id: string) {
  await db.chat.delete({ where: { id } });
}
