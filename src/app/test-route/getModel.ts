import { openai } from "@ai-sdk/openai";
import { type LanguageModel } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { type Provider } from "../types";

export function getModel(provider?: Provider, modelId?: string): LanguageModel {
  switch (provider) {
    case "openai":
      return openai(modelId ?? "gpt-3.5-turbo");
    case "anthropic":
      return anthropic(modelId ?? "claude-3-haiku-20240307");
    default:
      return openai("gpt-3.5-turbo");
  }
}
