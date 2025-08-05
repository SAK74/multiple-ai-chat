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
import dynamic from "next/dynamic";
import { ChatHistorySkeleton } from "./ChatsSkeleton";

const ChatHistory = dynamic(
  () => import("./ChatHistory").then((m) => m.ChatHistory),
  { loading: () => <ChatHistorySkeleton /> }
);

export const SideBarComp: FC<{ userId?: string; chatId?: string }> = async ({
  userId,
  chatId,
}) => {
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
                  <ChatHistory {...{ chatId, userId }} />
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
