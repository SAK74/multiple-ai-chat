"use client";

import { useChat } from "@ai-sdk/react";
import { useUsage } from "./components/localStorage.hook";
import { useState } from "react";
import { ModelSelector } from "./components/ModelSelector";
import { Usage } from "./components/Usage";
import type { ModelId, Provider } from "../types";
import "highlight.js/styles/default.css";
import { RenderMessages } from "./components/RenderMessages";

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

  // const bottomRef = useRef<HTMLDivElement>(null);
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
      <RenderMessages messages={messages} />
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
