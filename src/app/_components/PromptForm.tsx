import { Textarea } from "@/src/components/ui/textarea";
import type { Dispatch, FC, FormEventHandler, SetStateAction } from "react";
import { ModelSelector } from "./ModelSelector";
import type { ModelId, Provider } from "../types";
import { Button } from "@/src/components/ui/button";
import {
  BanIcon,
  BrushCleaningIcon,
  RefreshCcwIcon,
  SendHorizonalIcon,
} from "lucide-react";
import { Tooltip } from "@/src/components/Tooltip";
import type { UseChatHelpers } from "@ai-sdk/react";
import { Spinner } from "./Spinner";

type PromtFormProps = Partial<UseChatHelpers> & {
  onQuerySubmit: FormEventHandler;
  provider?: Provider;
  setProvider: Dispatch<SetStateAction<Provider | undefined>>;
  model?: ModelId;
  setModel: Dispatch<SetStateAction<ModelId | undefined>>;
  isActive: boolean;
};

export const PromtForm: FC<PromtFormProps> = ({
  input,
  onQuerySubmit,
  handleInputChange,
  provider,
  setProvider,
  model,
  setModel,
  isActive,
  reload,
  setMessages,
  status,
}) => {
  return (
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
        className="absolute left-3 -bottom-3 z-10 bg-accent rounded-lg border px-3"
        model={model}
        setModel={setModel}
        isActive={isActive}
      />
      <Button
        variant={"ghost"}
        size={"icon"}
        className="absolute right-3 bottom-7 cursor-pointer"
        disabled={!isActive}
      >
        {isActive ? (
          <SendHorizonalIcon className="size-6" />
        ) : (
          <Spinner className="size-6" />
        )}
      </Button>

      <div className="flex gap-4 absolute right-3 -bottom-3 z-10 bg-accent border rounded-lg px-5 *:cursor-pointer *:size-6">
        {reload && (
          <Tooltip
            label="Reload"
            onClick={() => {
              reload();
            }}
            disabled={status === "streaming" || status === "submitted"}
          >
            <Button size={"icon"} variant={"ghost"}>
              <RefreshCcwIcon />
            </Button>
          </Tooltip>
        )}
        <Tooltip
          label="Stop rendering"
          onClick={() => {
            stop();
          }}
          disabled={status !== "submitted"}
        >
          <Button size={"icon"} variant={"ghost"}>
            <BanIcon />
          </Button>
        </Tooltip>
        {setMessages && (
          <Tooltip
            label="Clear the chat history"
            onClick={() => {
              setMessages([]);
            }}
            disabled={status !== "ready"}
          >
            <Button size={"icon"} variant={"ghost"}>
              <BrushCleaningIcon />
            </Button>
          </Tooltip>
        )}
      </div>
    </form>
  );
};
