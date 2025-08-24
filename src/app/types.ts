import type { AnthropicMessagesModelId } from "@ai-sdk/anthropic/internal";
import type { OpenAIChatModelId } from "@ai-sdk/openai/internal";
import type { GoogleGenerativeAIModelId } from "@ai-sdk/google/internal";

export type Provider = "openai" | "anthropic" | "gemini";

export type ModelId =
  | OpenAIChatModelId
  | AnthropicMessagesModelId
  | GoogleGenerativeAIModelId;
