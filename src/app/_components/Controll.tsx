"use client";

import { cn } from "@/src/lib/utils";
import { type FC, type PropsWithChildren } from "react";
import { SettingsIcon } from "lucide-react";
import { ThemeChanger } from "./ThemeChanger";
import { SetupForm } from "./SetupForm";
import { Button } from "@/src/components/ui/button";
import { UserIcon } from "./UserIcon";
import { Usage } from "./Usage";
import type { User } from "next-auth";
import { useApikey } from "../../hooks/localStorage.hook";

export const ControllPanel: FC<
  PropsWithChildren<{ className?: string; user?: User }>
> = ({ className, user }) => {
  const { apiKey, setApiKey } = useApikey();

  return (
    <div
      className={cn(
        "flex text-right justify-between items-center sticky top-0 bg-transparent backdrop-blur-sm z-10",
        className
      )}
    >
      <div>{!apiKey && <Usage className="" />}</div>

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
