"use client";

import { Tooltip } from "@/src/components/Tooltip";
import { SidebarTrigger, useSidebar } from "@/src/components/ui/sidebar";

export const SideBarTrigger = () => {
  const { open } = useSidebar();
  return (
    <Tooltip label={open ? "Close the history" : "Show history"}>
      <SidebarTrigger className="sticky float-left top-16 cursor-pointer z-10 backdrop-blur-lg" />
    </Tooltip>
  );
};
