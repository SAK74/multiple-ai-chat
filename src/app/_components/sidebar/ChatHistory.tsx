import type { FC } from "react";
import { ChatItem } from "./ChatItem";
import type { Chat, Message } from "@prisma/client";
import { getUsersChats as cachedUsersChats } from "@/src/services/getUsersChats";

export const ChatHistory: FC<{ userId?: string; chatId?: string }> = async ({
  userId,
  chatId,
}) => {
  let chats: (Chat & { messages: Message[] })[] = [];
  if (userId) {
    chats = await cachedUsersChats(userId);
  }
  return (
    <>
      {chats.map((chat) => (
        <ChatItem key={chat.id} {...{ chat, chatId }} />
      ))}
    </>
  );
};
