"use client";

import { useChat } from "@ai-sdk/react";
import { useUsage } from "./localStorage.hook";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/src/lib/utils";
import { ModelSelector } from "./components/ModelSelector";
import { Usage } from "./components/Usage";
import type { ModelId, Provider } from "../types";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/default.css";

export default function Page() {
  const { usage, setUsage } = useUsage();
  const [assystentDescription, setAssysDescription] = useState<
    string | undefined
  >();
  const [provider, setProvider] = useState<Provider>("openai");
  const [model, setModel] = useState<ModelId | undefined>();

  const {
    messages,
    handleSubmit,
    input,
    handleInputChange,
    status,
    // append,
    setMessages,
    error,
    // data,
    setData,
  } = useChat({
    api: "/test-route",
    onFinish(_, options) {
      setUsage(usage + options.usage.totalTokens);
      // bottomRef.current?.scrollIntoView();
    },
    // initialMessages:[]
    body: {
      system: assystentDescription,
      provider,
      model,
    },
  });

  const bottomRef = useRef<HTMLDivElement>(null);
  // useEffect(() => {
  //   bottomRef.current?.scrollIntoView();
  // }, [messages]);

  return (
    <div className="px-6">
      <Usage className="fixed top-4 right-8" />
      <ModelSelector
        provider={provider}
        setProvider={setProvider}
        className="fixed top-6 left-4"
        model={model}
        setModel={setModel}
      />
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
                  // return <span key={index}>{part.text}</span>;
                  return (
                    <span key={index} className="space-y-4">
                      <Markdown
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                          pre: (props) => {
                            const codeRef = useRef<HTMLPreElement>(null);
                            const [copied, setCopied] = useState(false);
                            let timeoutId: number | undefined;
                            useEffect(() => {
                              return () => {
                                if (timeoutId) {
                                  // timeoutId?.close();
                                  clearTimeout(timeoutId);
                                }
                              };
                            }, []);

                            const onCopy = async () => {
                              const text = codeRef.current?.innerText ?? "";
                              if (navigator.clipboard) {
                                // console.log({ text });
                                await navigator.clipboard.writeText(text);
                                setCopied(true);
                                timeoutId = window.setTimeout(() => {
                                  setCopied(false);
                                }, 5000);
                                // set copied icon
                              }
                            };

                            return (
                              <div className="mx-auto max-w-fit relative">
                                <pre ref={codeRef} {...props} />
                                <button
                                  className="absolute top-2 right-2 cursor-pointer"
                                  onClick={onCopy}
                                  disabled={copied}
                                >
                                  {!copied ? "copy" : "copied"}
                                  {/* copy icon */}
                                </button>
                              </div>
                            );
                          },
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
      {/* <div ref={bottomRef} /> */}
      {status === "submitted" && <div>Loading....</div>}
      {status === "error" && <p>{error?.message}</p>}
      <form
        onSubmit={(ev) => {
          setData(undefined);
          handleSubmit(ev);
        }}
      >
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Send a message..."
          disabled={status === "streaming" || status === "submitted"}
        />
      </form>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          const value = ev.currentTarget["descriptor"].value;
          ev.currentTarget["descriptor"].value = "";
          setAssysDescription(value);
        }}
      >
        <input
          type="text"
          name="descriptor"
          placeholder="Assystent description"
        />
      </form>
      <button
        onClick={() => {
          setMessages([]);
        }}
      >
        Clear chat history
      </button>
    </div>
  );
}
