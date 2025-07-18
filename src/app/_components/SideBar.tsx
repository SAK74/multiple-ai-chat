import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenuItem,
} from "@/src/components/ui/sidebar";
import { BanIcon, Icon, MessageSquareMoreIcon } from "lucide-react";

export const SideBarComp = () => {
  // const chats = useSwr(...)
  return (
    <Sidebar className="pt-16" collapsible="offcanvas" variant="floating">
      {/* <SidebarInset>
        <SidebarContent>Content</SidebarContent>
      </SidebarInset> */}
      {/* <SidebarHeader>Header</SidebarHeader> */}
      <SidebarContent className="p-2">
        {Array.from({ length: 5 }, (_, i) => (
          <MessageSquareMoreIcon key={i} />
        ))}
      </SidebarContent>
    </Sidebar>
  );
};
