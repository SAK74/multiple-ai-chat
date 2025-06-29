"use client";

import { useChat } from "@ai-sdk/react";
import { useUsage } from "./localStorage.hook";
import { useEffect, useState } from "react";
import { cn } from "@/src/lib/utils";
import { ModelSelector } from "./components/ModelSelector";
import { Usage } from "./components/Usage";
import type { ModelId, Provider } from "../types";

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
    data,
    setData,
  } = useChat({
    api: "/test-route",
    onFinish(_, options) {
      setUsage((usage ?? 0) + options.usage.totalTokens);
    },
    // initialMessages:[]
    // experimental_throttle: 1000,
    body: {
      system: assystentDescription,
      provider,
      model,
    },
  });

  useEffect(() => {
    console.log({ data: data?.at(-1) });
  }, [data?.length]);

  if (status === "error") {
    console.log(error);
  }

  return (
    <div className="px-6">
      {/* <div className="fixed top-4 right-8">Total used tokens: {usage}</div> */}
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
          <span
            className={cn("rounded border border-dotted p-2", {
              "border-solid bg-gray-400 inline-block w-1/2 overflow-x-auto":
                message.role === "user",
            })}
          >
            {message.parts.map((part, index) => {
              switch (part.type) {
                case "text":
                  return <span key={index}>{part.text}</span>;
                case "source":
                  return <span key={index}>{part.source.url}</span>;
              }
            })}
          </span>
        </div>
      ))}
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
