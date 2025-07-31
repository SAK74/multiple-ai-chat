import type { Message, UIMessage } from "ai";
import { memo, type FC } from "react";
import type { Provider } from "../types";
import Image from "next/image";
import { cn } from "@/src/lib/utils";
import claudeLogo from "@/src/assets/claude-ai.svg";
import gptLogo from "@/src/assets/chatgpt.svg";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { MarkDownPre } from "./MarkdownPreComponent";
import { Tooltip } from "@/src/components/Tooltip";
import { Trash2Icon } from "lucide-react";

const logos: {
  [k in Provider]: {
    icon: string;
    className?: string;
  };
} = {
  openai: { icon: gptLogo, className: "dark:invert" },
  anthropic: { icon: claudeLogo },
};

const RenderedMessage: FC<{
  message: UIMessage;
  onDelete: (id: Message["id"]) => void;
}> = ({ message, onDelete }) => {
  const provider = message.annotations?.find(
    (adnot): adnot is { provider: Provider } =>
      typeof adnot === "object" &&
      adnot !== null &&
      "provider" in adnot &&
      typeof (adnot as { provider: Provider }).provider === "string"
  )?.provider;

  return (
    <div
      key={message.id}
      className={cn("my-2 flex items-center gap-2 justify-center", {
        "justify-end": message.role === "user",
      })}
    >
      {message.role === "user" && <strong>You: </strong>}
      {message.role === "assistant" && provider && (
        <Image
          src={logos[provider].icon}
          alt="provider_logo"
          width={25}
          height={25}
          className={cn("self-start mt-2", logos[provider].className)}
        />
      )}
      <div
        className={cn(
          "rounded-lg border border-foreground border-dotted p-2 text-left overflow-x-auto max-w-11/12",
          {
            "border-solid bg-gray-300 max-w-1/2 dark:bg-gray-600":
              message.role === "user",
          }
        )}
      >
        {message.parts.map((part, index) => {
          switch (part.type) {
            case "text":
              return (
                <div key={index} className="whitespace-pre-line">
                  <Markdown
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      pre: MarkDownPre,
                      ol: ({ children }) => (
                        <ol className="list-decimal pl-5">{children}</ol>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc pl-5">{children}</ul>
                      ),
                    }}
                  >
                    {part.text}
                  </Markdown>
                </div>
              );
            // case "source":
            //   return <span key={index}>{part.source.url}</span>;
          }
        })}
      </div>
      <span className="*:size-4 *:cursor-pointer">
        <Tooltip
          label="Remove message from the chat"
          onClick={() => onDelete(message.id)}
        >
          <Trash2Icon />
        </Tooltip>
      </span>
    </div>
  );
};

export const MemoizedMessage = memo(RenderedMessage);
