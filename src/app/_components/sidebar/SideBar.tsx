import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from "@/src/components/ui/sidebar";
import { FileQuestionMarkIcon, PencilLineIcon } from "lucide-react";
import Link from "next/link";
import { randomUUID } from "node:crypto";
import type { FC } from "react";
import { ChatItem } from "./ChatItem";
import { Chat, Message } from "@prisma/client";
import { getUsersChats as cachedUsersChats } from "@/src/services/getUsersChats";

export const SideBarComp: FC<{ userId?: string; chatId?: string }> = async ({
  userId,
  chatId,
}) => {
  let chats: (Chat & { messages: Message[] })[] = [];
  if (userId) {
    const getUsersChats = await cachedUsersChats(userId);
    chats = await getUsersChats(userId);
  }

  return (
    <Sidebar className="pt-16" collapsible="icon" variant="floating">
      <SidebarContent className="p-2 gap-0">
        {userId ? (
          <>
            <SidebarGroup>
              <SidebarMenuButton asChild className="hover:bg-accent/50">
                <Link href={`/${randomUUID()}`} className="flex gap-2">
                  <PencilLineIcon />
                  <span>New chat</span>
                </Link>
              </SidebarMenuButton>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>History</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-3">
                  {chats.map((chat) => (
                    <ChatItem key={chat.id} {...{ chat, chatId }} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        ) : (
          <SidebarMenuButton
            className="cursor-pointer hover:bg-background py-6"
            disabled
          >
            <FileQuestionMarkIcon />
            <p>You must be llogged to see chat history...</p>
          </SidebarMenuButton>
        )}
      </SidebarContent>
    </Sidebar>
  );
};
