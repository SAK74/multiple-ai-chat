import { type FC } from "react";
import { ModelId, type Provider } from "../types";
import { cn } from "@/src/lib/utils";
import type { OpenAIChatModelId } from "@ai-sdk/openai/internal";
import type { AnthropicMessagesModelId } from "@ai-sdk/anthropic/internal";
import { Select } from "@/src/components/Select";

const providers: Provider[] = ["openai", "anthropic"];

const openAiModels: OpenAIChatModelId[] = [
  "gpt-3.5-turbo",
  "gpt-4-turbo",
  "gpt-4.1",
  "gpt-4o-mini",
  "o1",
  "o1-mini",
  "o3",
  "o3-mini",
  "o4-mini",
];

const anthropicModels: AnthropicMessagesModelId[] = [
  "claude-3-haiku-20240307",
  "claude-3-5-haiku-latest",
  "claude-3-sonnet-20240229",
  "claude-3-5-sonnet-latest",
  "claude-3-7-sonnet-20250219",
  "claude-3-opus-20240229",
  "claude-3-opus-latest",
];

const models: {
  [k in Provider]: (OpenAIChatModelId | AnthropicMessagesModelId)[];
} = {
  openai: openAiModels,
  anthropic: anthropicModels,
};

export const ModelSelector: FC<{
  provider: Provider;
  setProvider: (provider: Provider) => void;
  className?: string;
  model?: ModelId;
  setModel: (model?: ModelId) => void;
  isActive: boolean;
}> = ({ className, provider, setProvider, model, setModel, isActive }) => {
  return (
    <div className={cn("flex gap-2", className)}>
      <Select
        className="border-none bg-accent dark:bg-accent"
        optionsClassName="capitalize"
        value={provider}
        options={providers}
        onChange={(value) => {
          setProvider(value as Provider);
        }}
        disabled={!isActive}
        size="sm"
      />

      <Select
        value={models[provider].includes(model!) ? model : undefined}
        onChange={(value) => {
          setModel(value ? (value as ModelId) : undefined);
        }}
        disabled={!isActive}
        options={models[provider]}
        size="sm"
        className="border-none bg-accent dark:bg-accent"
      />
    </div>
  );
};
