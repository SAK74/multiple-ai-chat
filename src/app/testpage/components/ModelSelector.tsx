import { type FC } from "react";
import { ModelId, type Provider } from "../../types";
import { cn } from "@/src/lib/utils";
import type { OpenAIChatModelId } from "@ai-sdk/openai/internal";
import type { AnthropicMessagesModelId } from "@ai-sdk/anthropic/internal";

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

export const ModelSelector: FC<{
  provider: Provider;
  setProvider: (provider: Provider) => void;
  className?: string;
  model?: ModelId;
  setModel: (model: ModelId) => void;
}> = ({ className, provider, setProvider, model, setModel }) => {
  let models: ModelId[] = [];
  switch (provider) {
    case "openai":
      models = openAiModels;
      break;
    case "anthropic":
      models = anthropicModels;
      break;
  }
  return (
    <div className={cn("", className)}>
      <select
        className="capitalize"
        value={provider}
        onChange={({ target: { value } }) => {
          setProvider(value as Provider);
        }}
      >
        {providers.map((name) => (
          <option key={name}>{name}</option>
        ))}
      </select>

      <select
        value={model}
        onChange={({ target: { value } }) => {
          setModel(value as ModelId);
        }}
      >
        {models.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>
    </div>
  );
};
