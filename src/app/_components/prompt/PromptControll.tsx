import { type FC, type PropsWithChildren } from "react";
import { ModelSelector } from "../ModelSelector";
import type { CommonPromptProps } from "./";
import { BanIcon, BrushCleaningIcon, RefreshCcwIcon } from "lucide-react";
import type { UseChatHelpers } from "@ai-sdk/react";
import { Tooltip } from "@/src/components/Tooltip";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { useSession } from "next-auth/react";

export const PromptControll: FC<
  PropsWithChildren<
    Omit<CommonPromptProps, "onQuerySubmit"> &
      Pick<UseChatHelpers, "reload" | "setMessages" | "status">
  >
> = ({
  children,
  className,
  provider,
  setProvider,
  model,
  setModel,
  isActive,
  reload,
  setMessages,
  status,
}) => {
  const { data } = useSession();
  return (
    <div
      className={cn(
        "w-full flex justify-between gap-2 px-3 *:bg-accent",
        className
      )}
    >
      <ModelSelector
        provider={provider}
        setProvider={setProvider}
        className="rounded-lg border"
        model={model}
        setModel={setModel}
        isActive={isActive}
      />
      <div className="!bg-transparent grow flex justify-start">
        {/* attachments panel */}
        {children}
      </div>

      {/* controls */}
      <div className="flex gap-4 border rounded-lg px-5 *:cursor-pointer *:size-6">
        <Tooltip
          label="Reload"
          onClick={() => {
            reload();
          }}
          disabled={status === "streaming" || status === "submitted"}
        >
          <Button size={"icon"} variant={"ghost"}>
            <RefreshCcwIcon />
          </Button>
        </Tooltip>

        <Tooltip
          label="Stop rendering"
          onClick={() => {
            stop();
          }}
          disabled={status !== "streaming" && status !== "submitted"}
        >
          <Button size={"icon"} variant={"ghost"}>
            <BanIcon />
          </Button>
        </Tooltip>

        {!data?.user && (
          <Tooltip
            label="Clear the chat history"
            onClick={() => {
              setMessages([]);
            }}
            disabled={status !== "ready"}
          >
            <Button size={"icon"} variant={"ghost"}>
              <BrushCleaningIcon />
            </Button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};
