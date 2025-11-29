import { SidebarMenuItem } from "@/src/components/ui/sidebar";

export const ChatHistorySkeleton = () => {
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <SidebarMenuItem key={i}>
          <div
            data-slot="sidebar-menu-skeleton"
            data-sidebar="menu-skeleton"
            className="flex h-8 items-center gap-2 rounded-md px-2"
          >
            <div
              data-slot="skeleton"
              className="bg-slate-300 animate-pulse size-4 rounded-md "
              data-sidebar="menu-skeleton-icon"
            ></div>
            <div
              data-slot="skeleton"
              className="bg-slate-300 animate-pulse rounded-md h-4 max-w-(--skeleton-width) flex-1"
              data-sidebar="menu-skeleton-text"
              style={
                {
                  "--skeleton-width": `${Math.round(Math.random() * 40) + 50}%`,
                } as React.CSSProperties
              }
            ></div>
          </div>
        </SidebarMenuItem>
      ))}
    </>
  );
};
