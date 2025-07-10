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
import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "../components/ui/sidebar";
import { SideBarComp } from "./_components/SideBar";
import { Tooltip } from "../components/Tooltip";

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

  const { messages, handleSubmit, setMessages, error, status } = chat;
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
    // setData(undefined);
  };

  // const { state } = useSidebar();
  // console.log({ state });

  return (
    <div className="">
      <ControllPanel className="py-3 px-4" {...{ apiKey, setApiKey }}>
        {!apiKey && <Usage className="" />}
      </ControllPanel>
      <SidebarProvider>
        <SideBarComp />
        {/* <div className="px-6 w-full">
        <ControllPanel className="py-3" {...{ apiKey, setApiKey }}>
          {!apiKey && <Usage className="" />}
        </ControllPanel> */}
        <div className="px-6 w-full relative">
          {/* <ControllPanel className="py-3" {...{ apiKey, setApiKey }}>
          {!apiKey && <Usage className="" />}
        </ControllPanel> */}
          <Tooltip label="Show history">
            <SidebarTrigger className="sticky float-left top-16 cursor-pointer z-10 backdrop-blur-lg" />
          </Tooltip>

          <RenderMessages messages={messages} setMessages={setMessages} />
          <div ref={bottomRef} className="h-4" />
          {status === "submitted" && (
            <div className="inline-block">
              <Spinner />
            </div>
          )}
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
        {/* </div> */}
      </SidebarProvider>
    </div>

    // <div className="px-6 w-full">
    //   <ControllPanel className="py-3" {...{ apiKey, setApiKey }}>
    //     {!apiKey && <Usage className="" />}
    //   </ControllPanel>
    //   <div className="">
    //     {/* <ControllPanel className="py-3" {...{ apiKey, setApiKey }}>
    //       {!apiKey && <Usage className="" />}
    //     </ControllPanel> */}
    //     <SidebarTrigger />

    //     <RenderMessages messages={messages} setMessages={setMessages} />
    //     <div ref={bottomRef} className="h-4" />
    //     {status === "ready" && (
    //       <div className="inline-block">
    //         <Spinner />
    //       </div>
    //     )}
    //     {status === "error" && (
    //       <p className="text-destructive/85">{error?.message}</p>
    //     )}

    //     <PromtForm
    //       {...{
    //         ...chat,
    //         provider,
    //         setProvider,
    //         model,
    //         setModel,
    //         isActive,
    //         onQuerySubmit,
    //       }}
    //     />
    //   </div>
    // </div>
  );
}
