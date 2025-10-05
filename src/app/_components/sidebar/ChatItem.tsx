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
  useRef,
  useEffect,
  useState,
  useTransition,
  useId,
} from "react";
import { Spinner } from "../Spinner";
import { useRouter } from "next/navigation";
import { v4 as uuid } from "uuid";

export const ChatItem: FC<{
  chat: Chat & { messages: Message[] };
  chatId?: string;
}> = ({ chat, chatId }) => {
  const { replace } = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const onRemoveClick = async () => {
    await removeChatById(chat.id);
    revalidateChats();
    replace(uuid());
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

  const menuId = `menu_${useId()}`;

  useEffect(() => {
    const handleClickOutside = ({ target }: MouseEvent) => {
      if (isEditMode && target !== inputRef.current) {
        const isDropdownMenuItem =
          target instanceof Element && target.closest(`#${menuId}`);
        if (!isDropdownMenuItem) {
          setIsEditMode(false);
        }
      }
    };

    if (isEditMode) {
      inputRef.current?.focus();
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isEditMode]);

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
              <DropdownMenuContent id={menuId}>
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
            ref={inputRef}
          />
        </form>
      )}
    </SidebarMenuItem>
  );
};
