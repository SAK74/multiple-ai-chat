import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/src/components/ui/sidebar";
import { db } from "@/src/lib/prisma";
import {
  FileQuestionMarkIcon,
  MessageSquareMoreIcon,
  PencilLineIcon,
} from "lucide-react";
import Link from "next/link";
import { randomUUID } from "node:crypto";
import type { FC } from "react";

export const SideBarComp: FC<{ userId?: string }> = async ({ userId }) => {
  const chats = !userId
    ? []
    : await db.chat.findMany({
        include: { messages: true },
        where: { userId },
      });
  return (
    <Sidebar className="pt-16" collapsible="icon" variant="floating">
      {/* <SidebarHeader>Header</SidebarHeader> */}
      <SidebarContent className="p-2">
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
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton asChild className="hover:bg-accent/50">
                        <Link
                          href={`/${chat.id}`}
                          className="flex gap-2 items-center"
                        >
                          <MessageSquareMoreIcon />
                          <span className="text-sm overflow-hidden text-left">
                            <div className="text-sm font-semibold text-ellipsis overflow-hidden whitespace-pre">
                              {chat.messages[1].content}
                            </div>
                            <div className="text-xs">
                              {chat.created.toLocaleString()}
                            </div>
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
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
