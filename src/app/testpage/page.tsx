"use client";

import { useChat } from "@ai-sdk/react";
import { useUsage } from "./components/localStorage.hook";
import { useEffect, useMemo, useState, type FormEventHandler } from "react";
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
  const [apiKey, setApiKey] = useState<string | undefined>();

  const isActive = useMemo(
    () => usage < 2000 || Boolean(apiKey),
    [usage, apiKey]
  );

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
    reload,
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
      apiKey,
    },
  });

  // const bottomRef = useRef<HTMLDivElement>(null);
  // useEffect(() => {
  //   bottomRef.current?.scrollIntoView();
  // }, [messages]);

  const onQuerySubmit: FormEventHandler = (ev) => {
    if (!isActive) {
      ev.preventDefault();
      // show appropriate message
      window.alert("You have reached tokens limit, provide your api_key!");
      return;
    }
    handleSubmit(ev);
    setData(undefined);
  };

  return (
    <div className="px-6">
      {!apiKey && <Usage className="fixed left-4 top-16" />}
      <ModelSelector
        provider={provider}
        setProvider={setProvider}
        className="fixed top-6 left-4"
        model={model}
        setModel={setModel}
        isActive={isActive}
      />
      <RenderMessages messages={messages} />
      {/* <div ref={bottomRef} /> */}
      {status === "submitted" && <div>Loading....</div>}
      {status === "error" && <p>{error?.message}</p>}
      <form onSubmit={onQuerySubmit}>
        <textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Send a message..."
          disabled={status === "streaming" || status === "submitted"}
          onKeyDown={(ev) => {
            // console.log({ key });
            const { key, shiftKey, altKey, ctrlKey } = ev;
            if (key === "Enter" && !shiftKey && !altKey && !ctrlKey) {
              // console.log(ev.currentTarget.form);
              ev.preventDefault();
              ev.currentTarget.form?.requestSubmit();
            }
          }}
        />
      </form>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          const value = ev.currentTarget["descriptor"].value;
          setAssysDescription(value);
        }}
        className="absolute left-4 top-32"
      >
        <textarea
          name="descriptor"
          placeholder="Assystent description"
          defaultValue={assystentDescription}
          onClick={(ev) => {
            ev.preventDefault();
            ev.currentTarget.form?.requestSubmit();
          }}
          onKeyDown={(ev) => {
            // console.log({ key });
            const { key, shiftKey, altKey, ctrlKey } = ev;
            if (key === "Enter" && !shiftKey && !altKey && !ctrlKey) {
              // console.log(ev.currentTarget.form);
              ev.preventDefault();
              ev.currentTarget.form?.requestSubmit();
            }
          }}
        />
      </form>
      <input
        type="text"
        placeholder="You API key"
        className="absolute left-4 top-24"
        value={apiKey ?? ""}
        onChange={({ target: { value } }) => {
          setApiKey(value);
        }}
      />
      <button onClick={() => reload()}>Reload</button>
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
