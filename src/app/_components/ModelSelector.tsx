"use client";

import { type FC, memo } from "react";
import type { GoogleGenerativeAIModelId, ModelId, Provider } from "../types";
import { cn } from "@/src/lib/utils";
import type { OpenAIChatModelId } from "@ai-sdk/openai/internal";
import type { AnthropicMessagesModelId } from "@ai-sdk/anthropic/internal";
import { Select } from "@/src/components/Select";
import { DEFAULT_PROVIDER } from "@/src/_constants";
import { useModel, useProvider } from "@/src/hooks/localStorage.hook";

const providers: Provider[] = ["openai", "anthropic", "gemini"];

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

const geminiMOdels: GoogleGenerativeAIModelId[] = [
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.5-pro",
];

const models: {
  [k in Provider]: (OpenAIChatModelId | AnthropicMessagesModelId)[];
} = {
  openai: openAiModels,
  anthropic: anthropicModels,
  gemini: geminiMOdels,
};

const DefaultModelSelector: FC<{
  className?: string;
  isActive: boolean;
}> = ({ className, isActive }) => {
  const { provider: storedProvider, setProvider } = useProvider();
  const provider = storedProvider ?? DEFAULT_PROVIDER;
  const { model, setModel } = useModel();

  return (
    <div className={cn("flex gap-2", className)}>
      <Select
        className="border-none bg-accent dark:bg-accent cursor-pointer"
        optionsClassName="capitalize"
        value={provider}
        options={providers}
        onChange={(value) => {
          if (!value) {
            return;
          }
          setProvider(value as Provider);
          setModel(models[value as Provider][0]);
        }}
        disabled={!isActive}
        size="xs"
      />

      <Select
        value={models[provider]?.includes(model!) ? model : undefined}
        onChange={(value) => {
          if (!value) {
            return;
          }

          setModel(value as ModelId);
        }}
        disabled={!isActive}
        options={models[provider]}
        size="xs"
        className="border-none bg-accent dark:bg-accent cursor-pointer"
      />
    </div>
  );
};

export const ModelSelector = memo(DefaultModelSelector);
