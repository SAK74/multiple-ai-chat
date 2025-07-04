import { openai, createOpenAI } from "@ai-sdk/openai";
import { type LanguageModel } from "ai";
import { anthropic, createAnthropic } from "@ai-sdk/anthropic";
import { type Provider } from "../../types";

export type GetModelParams = {
  provider?: Provider;
  modelId?: string;
  apiKey?: string;
};

export function getModel({
  provider,
  modelId,
  apiKey,
}: GetModelParams): LanguageModel {
  if (apiKey) {
    switch (provider) {
      case "openai":
        return createOpenAI({ apiKey })(modelId ?? "gpt-3.5-turbo");
      case "anthropic":
        return createAnthropic({ apiKey })(
          modelId ?? "claude-3-haiku-20240307"
        );
      default:
        return openai("gpt-3.5-turbo");
    }
  }
  switch (provider) {
    case "openai":
      return openai(modelId ?? "gpt-3.5-turbo");
    case "anthropic":
      return anthropic(modelId ?? "claude-3-haiku-20240307");
    default:
      return openai("gpt-3.5-turbo");
  }
}
