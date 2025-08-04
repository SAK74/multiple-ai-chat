"use client";

import { Textarea } from "@/src/components/ui/textarea";
import {
  type FormEvent,
  memo,
  useRef,
  useState,
  useId,
  type Dispatch,
  type FC,
  type SetStateAction,
  FormEventHandler,
} from "react";
import type { ModelId, Provider } from "../../types";
import { Button } from "@/src/components/ui/button";
import { PaperclipIcon, SendHorizonalIcon } from "lucide-react";
import type { UseChatHelpers } from "@ai-sdk/react";
import { cn } from "@/src/lib/utils";
import type { ChatRequestOptions } from "ai";
import { Tooltip } from "@/src/components/Tooltip";
import { AttachedImages, PromptControll } from ".";

export type CommonPromptProps = {
  onQuerySubmit: (ev: FormEvent, options?: ChatRequestOptions) => void;
  provider?: Provider;
  setProvider: Dispatch<SetStateAction<Provider | undefined>>;
  model?: ModelId;
  setModel: Dispatch<SetStateAction<ModelId | undefined>>;
  isActive: boolean;
  className?: string;
};

const RenderedPromtForm: FC<
  CommonPromptProps &
    Pick<
      UseChatHelpers,
      "input" | "handleInputChange" | "reload" | "setMessages" | "status"
    >
> = ({
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

  const attachmentsRef = useRef<Set<HTMLImageElement | null>>(new Set());

  const onSubmit: FormEventHandler = (ev) => {
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
      if (img) {
        URL.revokeObjectURL(img.src);
      }
    });
    attachmentsRef.current.clear();
  };

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "relative max-w-4/5 mx-auto outline focus-within:outline-3 rounded-md",
        className
      )}
    >
      <AttachedImages {...{ files, setFiles, attachmentsRef }} />

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

      <PromptControll
        {...{
          isActive,
          provider,
          setProvider,
          model,
          setModel,
          reload,
          setMessages,
          status,
        }}
        className="absolute -bottom-3 z-10"
      >
        <div className="!bg-transparent grow flex justify-start">
          {/* attchments */}
          <Tooltip label="Attach image">
            <label htmlFor={`file-${reactId}`}>
              <PaperclipIcon className="size-6 p-1 cursor-pointer rounded-lg bg-accent" />
            </label>
          </Tooltip>
          <input
            accept="image/*"
            id={`file-${reactId}`}
            type="file"
            multiple
            className="hidden"
            ref={inpuFileRef}
            onChange={({ target: { files } }) => {
              setFiles(files);
            }}
          />
        </div>
      </PromptControll>
    </form>
  );
};

export const PromptForm = memo(RenderedPromtForm);
