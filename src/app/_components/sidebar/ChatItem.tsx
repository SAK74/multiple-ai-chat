"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Input } from "@/src/components/ui/input";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/src/components/ui/sidebar";
import { changeChatName } from "@/src/services/changeChatName";
import { revalidateChats } from "@/src/services/getUsersChats";
import { removeChatById } from "@/src/services/removeChatById";
import type { Chat, Message } from "@prisma/client";
import {
  EllipsisIcon,
  MessageSquareMoreIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { type FC, type FormEventHandler, useState } from "react";

export const ChatItem: FC<{
  chat: Chat & { messages: Message[] };
  chatId?: string;
}> = ({ chat, chatId }) => {
  const onRemoveClick = async () => {
    await removeChatById(chat.id);
    revalidateChats();
  };

  const [isEditMode, setIsEditMode] = useState(false);

  const onEditClick = async () => {
    setIsEditMode(true);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (ev) => {
    ev.preventDefault();
    const newName = (ev.currentTarget["newName"] as HTMLInputElement).value;
    await changeChatName(chat.id, newName);
    revalidateChats();
    setIsEditMode(false);
  };
  return (
    <SidebarMenuItem key={chat.id}>
      {!isEditMode ? (
        <>
          <SidebarMenuButton
            asChild
            className="hover:bg-accent/80"
            isActive={chat.id === chatId}
          >
            <Link href={`/${chat.id}`} className="">
              <MessageSquareMoreIcon />
              <span className="text-sm overflow-hidden text-left">
                <div className="text-sm font-semibold text-ellipsis overflow-hidden whitespace-pre">
                  {chat.name || chat.messages[1].content.slice(0, 30)}
                </div>
                <div className="text-xs">{chat.created.toLocaleString()}</div>
              </span>
            </Link>
          </SidebarMenuButton>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuAction className="cursor-pointer">
                <EllipsisIcon className="hidden group-hover/menu-item:block" />
              </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onEditClick}>
                <PencilIcon />
                <span>Edit title</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onRemoveClick}>
                <Trash2Icon />
                <span>Remove</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <Input
            name="newName"
            defaultValue={chat.name || undefined}
            ref={(input) => {
              input?.focus();
            }}
          />
        </form>
      )}
    </SidebarMenuItem>
  );
};
