"use client";

import { useChat } from "@ai-sdk/react";
import { useUsage } from "./_components/localStorage.hook";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEventHandler,
} from "react";
import { Usage } from "./_components/Usage";
import type { ModelId, Provider } from "./types";
import { RenderMessages } from "./_components/RenderMessages";
import { ControllPanel } from "./_components/Controll";

import { TOKENS_LIMIT } from "./_constants";
import { showOverdraft } from "./_tools/overdraftMessage";
import { PromtForm } from "./_components/PromptForm";

export default function Page() {
  const { usage, setUsage } = useUsage();
  const [assystentDescription, setAssysDescription] = useState<
    string | undefined
  >();
  const [provider, setProvider] = useState<Provider>();
  const [model, setModel] = useState<ModelId | undefined>();
  const [apiKey, setApiKey] = useState<string | undefined>();

  const isActive = useMemo(
    () => usage < TOKENS_LIMIT || Boolean(apiKey),
    [usage, apiKey]
  );

  const chat = useChat({
    api: "/api/aichat",
    onFinish(_, options) {
      const summary = usage + options.usage.totalTokens;
      setUsage(summary);
      if (summary >= TOKENS_LIMIT) {
        showOverdraft();
      }
      // bottomRef.current?.scrollIntoView();
    },
    body: {
      system: assystentDescription,
      provider,
      model,
      apiKey,
    },
  });

  const { messages, handleSubmit, setMessages, error, status } = chat;
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [messages]);

  const onQuerySubmit: FormEventHandler = (ev) => {
    if (!isActive) {
      ev.preventDefault();
      showOverdraft();
      return;
    }
    handleSubmit(ev);
    // setData(undefined);
  };

  return (
    <div className="px-6">
      <ControllPanel className="py-3">
        {!apiKey && <Usage className="" />}
      </ControllPanel>
      <RenderMessages messages={messages} setMessages={setMessages} />
      <div ref={bottomRef} className="h-4" />
      {status === "submitted" && <div>Loading....</div>}
      {status === "error" && (
        <p className="text-destructive/85">{error?.message}</p>
      )}

      <PromtForm
        {...{
          ...chat,
          provider,
          setProvider,
          model,
          setModel,
          isActive,
          onQuerySubmit,
        }}
      />
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
            const { key, shiftKey, altKey, ctrlKey } = ev;
            if (key === "Enter" && !shiftKey && !altKey && !ctrlKey) {
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
    </div>
  );
}
