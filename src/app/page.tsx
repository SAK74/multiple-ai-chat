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
import { ModelSelector } from "./_components/ModelSelector";
import { Usage } from "./_components/Usage";
import type { ModelId, Provider } from "./types";
import { RenderMessages } from "./_components/RenderMessages";
import { ControllPanel } from "./_components/Controll";
import { Textarea } from "../components/ui/textarea";
import {
  BrushCleaningIcon,
  RefreshCcwIcon,
  SendHorizonalIcon,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Tooltip } from "../components/Tooltip";

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
    // setData,
    reload,
  } = useChat({
    api: "/api/aichat",
    onFinish(_, options) {
      setUsage(usage + options.usage.totalTokens);
      // bottomRef.current?.scrollIntoView();
    },
    body: {
      system: assystentDescription,
      provider,
      model,
      apiKey,
    },
  });

  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [messages]);

  const onQuerySubmit: FormEventHandler = (ev) => {
    if (!isActive) {
      ev.preventDefault();
      // show appropriate message
      window.alert("You have reached tokens limit, provide your api_key!");
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
      <RenderMessages messages={messages} />
      <div ref={bottomRef} />
      {status === "submitted" && <div>Loading....</div>}
      {status === "error" && (
        <p className="text-destructive/85">{error?.message}</p>
      )}
      <form onSubmit={onQuerySubmit} className="relative max-w-3/5 mx-auto">
        <Textarea
          className="pb-8 pr-10"
          value={input}
          onChange={handleInputChange}
          placeholder="Send a message..."
          disabled={status === "streaming" || status === "submitted"}
          onKeyDown={(ev) => {
            const { key, shiftKey, altKey, ctrlKey } = ev;
            if (key === "Enter" && !shiftKey && !altKey && !ctrlKey) {
              ev.preventDefault();
              ev.currentTarget.form?.requestSubmit();
            }
          }}
          ref={(input) => {
            input?.focus();
          }}
        />
        <ModelSelector
          provider={provider}
          setProvider={setProvider}
          className="absolute left-3 -bottom-3 z-10 bg-accent rounded-2xl border px-3"
          model={model}
          setModel={setModel}
          isActive={isActive}
        />
        <Button
          variant={"ghost"}
          size={"icon"}
          className="absolute right-3 bottom-7 cursor-pointer"
        >
          <SendHorizonalIcon className="size-6" />
        </Button>

        <div className="flex gap-4 absolute right-3 -bottom-3 z-10 bg-accent border rounded-lg px-5 py-2 *:cursor-pointer">
          <Tooltip label="Reload">
            <RefreshCcwIcon
              size={20}
              onClick={() => {
                reload();
              }}
            />
          </Tooltip>
          <Tooltip label="Clear the chat history">
            <BrushCleaningIcon
              size={20}
              onClick={() => {
                setMessages([]);
              }}
            />
          </Tooltip>
        </div>
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
