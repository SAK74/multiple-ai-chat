import { cn } from "@/src/lib/utils";
import type { UIMessage } from "ai";
import type { FC } from "react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import { MarkDownPre } from "./MarkdownPreComponent";

export const RenderMessages: FC<{ messages: UIMessage[] }> = ({ messages }) => {
  return (
    <>
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn("my-2 flex items-center gap-2 justify-center", {
            "justify-end": message.role === "user",
          })}
        >
          {message.role === "user" && <strong>You: </strong>}
          <div
            className={cn(
              "rounded-lg border border-dotted p-2 text-left overflow-x-auto max-w-11/12",
              {
                "border-solid bg-gray-300 max-w-1/2": message.role === "user",
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
      ))}
    </>
  );
};
