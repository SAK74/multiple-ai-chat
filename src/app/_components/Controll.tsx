import { cn } from "@/src/lib/utils";
import type { FC, PropsWithChildren } from "react";
import { SettingsIcon } from "lucide-react";
import { ThemeChanger } from "./ThemeChanger";
import { Avatar } from "@/src/components/Avatar";

export const ControllPanel: FC<PropsWithChildren<{ className?: string }>> = ({
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        "flex text-right justify-between mr-4 items-center cursor-pointer sticky top-0",
        className
      )}
    >
      <div>{children}</div>
      <div className="flex items-center">
        <ThemeChanger />
        <SettingsIcon />
        <Avatar />
      </div>
    </div>
  );
};
