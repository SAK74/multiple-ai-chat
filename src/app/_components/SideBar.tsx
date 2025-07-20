import { auth } from "@/src/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenuItem,
} from "@/src/components/ui/sidebar";
import { db } from "@/src/lib/prisma";
import {
  BanIcon,
  Icon,
  MessageSquareMoreIcon,
  PencilLineIcon,
} from "lucide-react";
import Link from "next/link";
import { randomUUID } from "node:crypto";
import { FC } from "react";

export const SideBarComp: FC<{ userId?: string }> = async ({ userId }) => {
  // const chats = useSwr(...)
  // const session = auth()
  // const userId
  const chats = !userId
    ? []
    : await db.chat.findMany({
        include: { messages: true },
        where: { userId },
      });
  return (
    <Sidebar className="pt-16" collapsible="offcanvas" variant="floating">
      {/* <SidebarHeader>Header</SidebarHeader> */}
      <SidebarContent className="p-2">
        <Link href={`/${randomUUID()}`} className="flex gap-2">
          <PencilLineIcon />
          <span>New chat</span>
        </Link>
        {chats.map((chat) => (
          <Link href={`/${chat.id}`} key={chat.id} className="flex gap-2">
            <span>
              <MessageSquareMoreIcon />
            </span>
            <span className="text-sm text-ellipsis overflow-hidden whitespace-pre">
              {chat.messages[1].content}
            </span>
          </Link>
        ))}
      </SidebarContent>
    </Sidebar>
  );
};
