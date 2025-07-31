"use client";

import { type Message, useChat } from "@ai-sdk/react";
import {
  FC,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEventHandler,
} from "react";
import type { ModelId, Provider } from "../types";

import { FINISH_NOTIFICATION, TOKENS_LIMIT } from "../_constants";
import { showOverdraft } from "../_tools/overdraftMessage";
import {
  ControllPanel,
  PromptForm,
  RenderMessages,
  Spinner,
  Usage,
  useAssistant,
  useUsage,
} from ".";
import { useRouter } from "next/navigation";
import { UserContext } from "./UserCtx";
import type { User } from "next-auth";
import { revalidateChats } from "@/src/services/getUsersChats";

export const Chat: FC<{
  chatId?: string;
  user?: User;
  initialMessagesPromise: Promise<Message[] | undefined>;
}> = ({ chatId, user, initialMessagesPromise }) => {
  const { usage, setUsage } = useUsage();
  const { assystentDescription } = useAssistant();
  const [provider, setProvider] = useState<Provider>();
  const [model, setModel] = useState<ModelId | undefined>();
  const [apiKey, setApiKey] = useState<string | undefined>();

  const { refresh } = useRouter();
  const initialMessages = use(initialMessagesPromise);
  const {
    messages,
    handleSubmit,
    setMessages,
    error,
    status,
    data: chatData,
    setData,
    input,
    handleInputChange,
    reload,
  } = useChat({
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

      if (user?.id) {
        refresh();
      }
    },
    body: {
      system: assystentDescription,
      provider,
      model,
      apiKey,
      ...(user?.id && { userId: user.id }),
    },
    ...(user && {
      experimental_prepareRequestBody({ id, messages }) {
        return {
          message: messages.at(-1),
          system: assystentDescription,
          provider,
          model,
          apiKey,
          id,
          ...(user?.id && { userId: user.id }),
        };
      },
    }),
  });

  const isActive = useMemo(
    () => usage < TOKENS_LIMIT || Boolean(apiKey),
    [usage, apiKey]
  );

  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [messages]);

  const onQuerySubmit: FormEventHandler = useCallback(
    (ev) => {
      if (!isActive) {
        ev.preventDefault();
        showOverdraft();
        return;
      }
      handleSubmit(ev);
    },
    [handleSubmit, isActive]
  );

  const [streamStatus, setStreamStatus] = useState<string>();
  useEffect(() => {
    const current = chatData?.at(-1);
    if (typeof current === "string") {
      setStreamStatus(current);
      if (current === FINISH_NOTIFICATION) {
        setData(undefined);
      }
    } else if (
      current !== null &&
      typeof current === "object" &&
      "newChat" in current
    ) {
      revalidateChats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatData?.length]);

  const memoUser = useMemo(() => user, [user]);

  return (
    <div className="px-6 w-full">
      <UserContext value={{ user: memoUser }}>
        <ControllPanel className="py-3 px-4" {...{ apiKey, setApiKey }}>
          {!apiKey && <Usage className="" />}
        </ControllPanel>
      </UserContext>

      <RenderMessages {...{ messages, setMessages, chatId }} />
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

      <PromptForm
        {...{
          input,
          handleInputChange,
          status,
          reload,
          setMessages,
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
