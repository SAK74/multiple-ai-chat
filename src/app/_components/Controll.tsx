"use client";

import { cn } from "@/src/lib/utils";
import type { FC, PropsWithChildren } from "react";
import { SettingsIcon } from "lucide-react";
import { ThemeChanger } from "./ThemeChanger";
import { SetupForm } from "./SetupForm";
import { Button } from "@/src/components/ui/button";
import { UserIcon } from "./UserIcon";
import { useChatContext } from "./ChatProvider";
import { Usage } from "./Usage";
import type { User } from "next-auth";

export const ControllPanel: FC<
  PropsWithChildren<{ className?: string; user?: User }>
> = ({ className, user }) => {
  const { apiKey, setApiKey } = useChatContext();

  return (
    <div
      className={cn(
        "flex text-right justify-between items-center sticky top-0 bg-transparent backdrop-blur-sm z-10",
        className
      )}
    >
      {!apiKey && <Usage className="" />}

      <div className="flex items-center *:cursor-pointer">
        <ThemeChanger />
        <SetupForm {...{ apiKey, setApiKey }}>
          <Button variant={"ghost"} size={"icon"}>
            <SettingsIcon className="size-6" />
          </Button>
        </SetupForm>
        <UserIcon user={user} />
      </div>
    </div>
  );
};
