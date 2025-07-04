import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { cn } from "@/src/lib/utils";
import { MoonIcon, SunIcon, SunMoonIcon } from "lucide-react";
import { useTheme } from "next-themes";
import type { FC } from "react";

export const ThemeChanger: FC<{ className?: string }> = ({ className }) => {
  const { setTheme, themes } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={cn("cursor-pointer", className)}>
        <Button variant={"ghost"} size={"icon"}>
          <SunIcon className="dark:hidden size-6" />
          <MoonIcon className="hidden dark:block size-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme}
            className="capitalize"
            onClick={() => {
              setTheme(theme);
            }}
          >
            {theme === "light" ? (
              <SunIcon />
            ) : theme === "dark" ? (
              <MoonIcon />
            ) : (
              <SunMoonIcon />
            )}
            {theme}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
