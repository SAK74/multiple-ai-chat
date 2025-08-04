"use client";

import { Textarea } from "@/src/components/ui/textarea";
import {
  type ChangeEventHandler,
  type FormEvent,
  memo,
  useRef,
  useState,
  useId,
  type Dispatch,
  type FC,
  type SetStateAction,
} from "react";
import { ModelSelector } from "./ModelSelector";
import type { ModelId, Provider } from "../types";
import { Button } from "@/src/components/ui/button";
import {
  BanIcon,
  BrushCleaningIcon,
  PaperclipIcon,
  RefreshCcwIcon,
  SendHorizonalIcon,
  XCircleIcon,
} from "lucide-react";
import { Tooltip } from "@/src/components/Tooltip";
import type { UseChatHelpers } from "@ai-sdk/react";
import { cn } from "@/src/lib/utils";
import type { ChatRequestOptions } from "ai";

type PromtFormProps = Pick<
  UseChatHelpers,
  "input" | "handleInputChange" | "reload" | "setMessages" | "status"
> & {
  onQuerySubmit: (ev: FormEvent, options?: ChatRequestOptions) => void;
  provider?: Provider;
  setProvider: Dispatch<SetStateAction<Provider | undefined>>;
  model?: ModelId;
  setModel: Dispatch<SetStateAction<ModelId | undefined>>;
  isActive: boolean;
  className?: string;
};

const RenderedPromtForm: FC<PromtFormProps> = ({
  input,
  onQuerySubmit,
  handleInputChange,
  provider,
  setProvider,
  model,
  setModel,
  isActive,
  reload,
  setMessages,
  status,
  className,
}) => {
  const inpuFileRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileList | null>(null);

  const reactId = useId();

  const handleFileInputChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { files },
  }) => {
    setFiles(files);
  };

  const attachmentsRef = useRef<(HTMLImageElement | null)[]>([]);

  return (
    <form
      onSubmit={async (ev) => {
        ev.preventDefault();
        onQuerySubmit(ev, {
          ...(files?.length && { experimental_attachments: files }),
        });
        setFiles(null);
        if (inpuFileRef.current) {
          inpuFileRef.current.value = "";
        }

        // remove object url's from memory
        attachmentsRef.current.forEach((img) => {
          console.log(img?.src);
          if (img) {
            URL.revokeObjectURL(img.src);
          }
        });
        attachmentsRef.current = [];
      }}
      className={cn(
        "relative max-w-4/5 mx-auto outline focus-within:outline-3 rounded-md",
        className
      )}
    >
      {/* Attached images */}
      <div className="p-2 flex gap-1 overflow-auto">
        {files &&
          Array.from(files).map((file, i) => (
            <div key={i} className="relative flex flex-wrap items-center">
              <img
                key={i}
                src={URL.createObjectURL(file)}
                alt={file.name}
                // width={160}
                // height={160}
                className="max-h-40 max-w-50 rounded-md object-contain"
                ref={(img) => {
                  attachmentsRef.current.push(img);
                }}
              />
              <Button
                type="button"
                size={"icon"}
                variant={"ghost"}
                className="cursor-pointer absolute right-0 top-0 hover:bg-accent/60 rounded-full dark:hover:bg-accent-foreground/30"
              >
                <XCircleIcon />
              </Button>
            </div>
          ))}
      </div>

      <Textarea
        name="prompt"
        className="pb-8 pr-10 !ring-0 focus-visible:border-none"
        value={input}
        onChange={handleInputChange}
        placeholder="Send a message..."
        disabled={status === "streaming" || status === "submitted"}
        onKeyDown={(ev) => {
          const { key, shiftKey, altKey, ctrlKey } = ev;
          if (key === "Enter" && !shiftKey && !altKey && !ctrlKey) {
            ev.preventDefault();
            ev.currentTarget.form?.requestSubmit();
          }
        }}
        ref={(input) => {
          input?.focus();
        }}
      />

      {/* send button */}
      <Button
        variant={"ghost"}
        size={"icon"}
        className="absolute right-3 bottom-7 cursor-pointer"
        disabled={!isActive || status !== "ready"}
      >
        <SendHorizonalIcon
          className={cn("size-6", {
            "animate-pulse": status === "submitted" || status === "streaming",
          })}
        />
      </Button>

      {/* controll panel */}
      <div className="absolute -bottom-3 z-10 w-full flex justify-between px-3 *:bg-accent">
        <ModelSelector
          provider={provider}
          setProvider={setProvider}
          className="rounded-lg border"
          model={model}
          setModel={setModel}
          isActive={isActive}
        />

        <div className="!bg-transparent grow flex justify-start pl-2">
          {/* attchments */}
          <label htmlFor={`file-${reactId}`}>
            <PaperclipIcon className="size-6 p-1 cursor-pointer rounded-lg bg-accent" />
          </label>
          <input
            accept="image/*"
            id={`file-${reactId}`}
            type="file"
            multiple
            className="hidden"
            ref={inpuFileRef}
            onChange={handleFileInputChange}
          />
          {/* {files && files[0].name} */}
        </div>

        {/* controls */}
        <div className="flex gap-4 border rounded-lg px-5 *:cursor-pointer *:size-6">
          {reload && (
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
          )}
          <Tooltip
            label="Stop rendering"
            onClick={() => {
              stop();
            }}
            disabled={status !== "submitted"}
          >
            <Button size={"icon"} variant={"ghost"}>
              <BanIcon />
            </Button>
          </Tooltip>
          {setMessages && (
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
    </form>
  );
};

export const PromptForm = memo(RenderedPromtForm);
