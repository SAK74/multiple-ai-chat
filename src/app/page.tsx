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
import type { ModelId, Provider } from "./types";
import { ControllPanel } from "./_components/Controll";

import { TOKENS_LIMIT } from "./_constants";
import { showOverdraft } from "./_tools/overdraftMessage";
import { PromtForm, RenderMessages, Spinner, Usage } from "./_components";

export default function Page() {
  const { usage, setUsage } = useUsage();
  const { assystentDescription } = useAssistant();
  const [provider, setProvider] = useState<Provider>();
  const [model, setModel] = useState<ModelId | undefined>();
  const [apiKey, setApiKey] = useState<string | undefined>();

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

  const {
    messages,
    handleSubmit,
    setMessages,
    error,
    status,
    data,
    setData,
    reload: chatReload,
  } = chat;
  const isActive = useMemo(
    () => usage < TOKENS_LIMIT || Boolean(apiKey),
    [usage, apiKey]
  );

  const [streamStatus, setStreamStatus] = useState<string>();
  useEffect(() => {
    const current = data?.at(-1);
    if (typeof current === "string") {
      setStreamStatus(current);
    }
  }, [data?.length]);

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
    setData(undefined);
  };

  return (
    <div className="px-6">
      <ControllPanel className="py-3" {...{ apiKey, setApiKey }}>
        {!apiKey && <Usage className="" />}
      </ControllPanel>
      <RenderMessages messages={messages} setMessages={setMessages} />
      <div ref={bottomRef} className="h-4" />
      {status === "submitted" && (
        <div className="inline-block">
          <Spinner />
        </div>
      )}
      {status === "streaming" && <div>{streamStatus}</div>}
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
          reload: () => {
            setData(undefined);
            return chatReload();
          },
        }}
      />
    </div>
  );
}
