"use client";

import { type FC, type PropsWithChildren } from "react";
import { cn } from "@/src/lib/utils";
import { useSidebar } from "@/src/components/ui/sidebar";

export const ChatWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { isMobile, open: isSidebarOpen } = useSidebar();

  return (
    <div
      className={cn("px-6 w-full", {
        "max-w-[calc(100%_-_var(--sidebar-width)_-_28px)]":
          !isMobile && isSidebarOpen,
        "max-w-[calc(100%_-_66px_-_28px)]": !isMobile && !isSidebarOpen,
      })}
    >
      {children}
    </div>
  );
};
