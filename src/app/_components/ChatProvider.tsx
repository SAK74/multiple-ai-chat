"use client";

import {
  createContext,
  type FC,
  type PropsWithChildren,
  useContext,
  useState,
} from "react";
import { SetupProps } from "./SetupForm";
import { cn } from "@/src/lib/utils";
import { useSidebar } from "@/src/components/ui/sidebar";

type ChatCtxType = SetupProps & {};

const ChatContext = createContext<ChatCtxType | null>(null);
export const ChatProvider: FC<PropsWithChildren> = ({ children }) => {
  const [apiKey, setApiKey] = useState<string>();
  const { isMobile, open: isSidebarOpen } = useSidebar();

  return (
    <ChatContext value={{ apiKey, setApiKey }}>
      <div
        className={cn("px-6 w-full", {
          "max-w-[calc(100%_-_var(--sidebar-width)_-_28px)]":
            !isMobile && isSidebarOpen,
          "max-w-[calc(100%_-_66px_-_28px)]": !isMobile && !isSidebarOpen,
        })}
      >
        {children}
      </div>
    </ChatContext>
  );
};

export const useChatContext = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw Error("Component isn't wrapped into ChatContext!");
  }
  return ctx;
};
