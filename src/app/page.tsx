"use client";

import { useChat } from "@ai-sdk/react";
import { useAssistant, useUsage } from "./_components/hooks/localStorage.hook";
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
  const { assystentDescription } = useAssistant();
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
      <ControllPanel className="py-3" {...{ apiKey, setApiKey }}>
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
    </div>
  );
}
