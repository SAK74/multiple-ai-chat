import { cn } from "@/src/lib/utils";
import type { FC, PropsWithChildren } from "react";
import { SettingsIcon } from "lucide-react";
import { ThemeChanger } from "./ThemeChanger";
import { Avatar } from "@/src/components/Avatar";
import { SetupForm, SetupProps } from "./SetupForm";
import { Button } from "@/src/components/ui/button";

export const ControllPanel: FC<
  PropsWithChildren<{ className?: string } & SetupProps>
> = ({ className, children, setApiKey, apiKey }) => {
  return (
    <div
      className={cn(
        "flex text-right justify-between mr-4 items-center sticky top-0",
        className
      )}
    >
      <div>{children}</div>
      <div className="flex items-center *:cursor-pointer">
        <ThemeChanger />
        <SetupForm {...{ apiKey, setApiKey }}>
          <Button variant={"ghost"} size={"icon"}>
            <SettingsIcon className="size-6" />
          </Button>
        </SetupForm>
        <Avatar />
      </div>
    </div>
  );
};
