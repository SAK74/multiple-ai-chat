import { cookies } from "next/headers";
import { SidebarProvider } from "../components/ui/sidebar";
import { SideBarComp } from "./_components/SideBar";
import { Chat } from "./_components/Chat";
import { SideBarTrigger } from "./_components/SideTrigger";

export default async function Page() {
  const cookiesState = await cookies();
  const isSidebarOpened = cookiesState.get("sidebar_state")?.value === "true";
  return (
    <SidebarProvider defaultOpen={isSidebarOpened}>
      <SideBarComp />
      <SideBarTrigger />
      <Chat />
    </SidebarProvider>
  );
}
