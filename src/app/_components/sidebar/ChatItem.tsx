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
import {
  type FC,
  type FormEventHandler,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import { Spinner } from "../Spinner";

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

  const [chatName, addOptimistic] = useOptimistic(
    chat.name ?? undefined,
    (_, newName: string) => {
      return newName;
    }
  );

  const [isUpdating, startTransition] = useTransition();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (ev) => {
    ev.preventDefault();
    setIsEditMode(false);
    const newName = (ev.currentTarget["newName"] as HTMLInputElement).value;
    startTransition(async () => {
      addOptimistic(newName);
      await changeChatName(chat.id, newName);
      await revalidateChats();
    });
  };

  return (
    <SidebarMenuItem>
      {!isEditMode ? (
        <>
          <SidebarMenuButton
            asChild
            className="hover:bg-accent/80"
            isActive={chat.id === chatId}
          >
            <Link href={`/${chat.id}`}>
              <MessageSquareMoreIcon />
              <span className="text-sm overflow-hidden text-left">
                <div className="text-sm font-semibold text-ellipsis overflow-hidden whitespace-pre">
                  {chatName ?? "<unknown>"}
                </div>
                <div className="text-xs">{chat.created.toLocaleString()}</div>
              </span>
            </Link>
          </SidebarMenuButton>
          {!isUpdating ? (
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
          ) : (
            <SidebarMenuAction disabled>
              <Spinner />
            </SidebarMenuAction>
          )}
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <Input
            name="newName"
            defaultValue={chat.name ?? undefined}
            ref={(input) => {
              input?.focus();
            }}
          />
        </form>
      )}
    </SidebarMenuItem>
  );
};
