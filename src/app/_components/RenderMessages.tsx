import { cn } from "@/src/lib/utils";
import type { UIMessage } from "ai";
import type { FC } from "react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { MarkDownPre } from "./MarkdownPreComponent";
import type { Provider } from "../types";

import claudeLogo from "@/src/assets/claude-ai.svg";
import gptLogo from "@/src/assets/chatgpt.svg";
import Image from "next/image";

const logos: {
  [k in Provider]: {
    icon: string;
    className?: string;
  };
} = {
  openai: { icon: gptLogo, className: "dark:invert" },
  anthropic: { icon: claudeLogo },
};

export const RenderMessages: FC<{ messages: UIMessage[] }> = ({ messages }) => {
  return (
    <>
      {messages.map((message) => {
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
                className={cn("self-start mt-6", logos[provider].className)}
              />
            )}

            <div
              className={cn(
                "rounded-lg border border-dotted p-2 text-left overflow-x-auto max-w-11/12",
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
                      <span key={index} className="space-y-4">
                        <Markdown
                          rehypePlugins={[rehypeHighlight]}
                          components={{
                            pre: MarkDownPre,
                          }}
                        >
                          {part.text}
                        </Markdown>
                      </span>
                    );
                  // case "source":
                  //   return <span key={index}>{part.source.url}</span>;
                }
              })}
            </div>
          </div>
        );
      })}
    </>
  );
};
