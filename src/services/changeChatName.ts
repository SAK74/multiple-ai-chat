"use server";

import { db } from "../lib/prisma";

export async function changeChatName(id: string, name: string) {
  await db.chat.update({ where: { id }, data: { name } });
}
