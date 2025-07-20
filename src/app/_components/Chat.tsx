"use client";

import { Message, useChat } from "@ai-sdk/react";
import {
  FC,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEventHandler,
} from "react";
import type { ModelId, Provider } from "../types";

import { TOKENS_LIMIT } from "../_constants";
import { showOverdraft } from "../_tools/overdraftMessage";
import {
  ControllPanel,
  PromtForm,
  RenderMessages,
  Spinner,
  Usage,
  useAssistant,
  useUsage,
} from ".";
import { useRouter } from "next/navigation";

export const Chat: FC<{
  chatId?: string;
  userId?: string;
  initialMessages?: Message[];
}> = ({ chatId, userId, initialMessages }) => {
  const { usage, setUsage } = useUsage();
  const { assystentDescription } = useAssistant();
  const [provider, setProvider] = useState<Provider>();
  const [model, setModel] = useState<ModelId | undefined>();
  const [apiKey, setApiKey] = useState<string | undefined>();

  const { refresh } = useRouter();

  const chat = useChat({
    api: "/api/aichat",
    id: chatId,
    sendExtraMessageFields: true,
    initialMessages,
    async onFinish(_, options) {
      const summary = usage + options.usage.totalTokens;
      setUsage(summary);
      if (summary >= TOKENS_LIMIT) {
        showOverdraft();
      }
      setStreamStatus(undefined);

      if (userId) {
        refresh();
      }
      // ....

      // mutate SWR??
    },
    body: {
      system: assystentDescription,
      provider,
      model,
      apiKey,
      ...(userId && { userId }),
    },
    // experimental_prepareRequestBody({ id, messages,  }) {
    //   return {
    //     message: messages[0],
    //     system: assystentDescription,
    //     provider,
    //     model,
    //     apiKey,
    //   };
    // },
  });

  const {
    messages,
    handleSubmit,
    setMessages,
    error,
    status,
    data: chatData,
  } = chat;
  const isActive = useMemo(
    () => usage < TOKENS_LIMIT || Boolean(apiKey),
    [usage, apiKey]
  );

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
  };

  const [streamStatus, setStreamStatus] = useState<string>();
  useEffect(() => {
    const current = chatData?.at(-1);
    if (typeof current === "string") {
      setStreamStatus(current);
    }
  }, [chatData?.length]);

  return (
    <div className="px-6 w-full">
      <ControllPanel className="py-3 px-4" {...{ apiKey, setApiKey }}>
        {!apiKey && <Usage className="" />}
      </ControllPanel>

      <RenderMessages messages={messages} setMessages={setMessages} />
      <div ref={bottomRef} className="h-4" />
      {status === "submitted" && (
        <div className="inline-block">
          <Spinner />
        </div>
      )}
      {streamStatus}
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
};
