import type { AnthropicMessagesModelId } from "@ai-sdk/anthropic/internal";
import type { OpenAIChatModelId } from "@ai-sdk/openai/internal";

export type Provider = "openai" | "anthropic" | "gemini";

export type GoogleGenerativeAIModelId =
  | "gemini-1.5-flash"
  | "gemini-1.5-flash-latest"
  | "gemini-1.5-flash-001"
  | "gemini-1.5-flash-002"
  | "gemini-1.5-flash-8b"
  | "gemini-1.5-flash-8b-latest"
  | "gemini-1.5-flash-8b-001"
  | "gemini-1.5-pro"
  | "gemini-1.5-pro-latest"
  | "gemini-1.5-pro-001"
  | "gemini-1.5-pro-002"
  | "gemini-2.0-flash"
  | "gemini-2.0-flash-001"
  | "gemini-2.0-flash-live-001"
  | "gemini-2.0-flash-lite"
  | "gemini-2.0-pro-exp-02-05"
  | "gemini-2.0-flash-thinking-exp-01-21"
  | "gemini-2.0-flash-exp"
  | "gemini-2.5-pro"
  | "gemini-2.5-flash"
  | "gemini-2.5-pro-exp-03-25"
  | "gemini-2.5-pro-preview-05-06"
  | "gemini-2.5-flash-preview-04-17"
  | "gemini-exp-1206"
  | "gemma-3-27b-it"
  | "learnlm-1.5-pro-experimental"
  | (string & {});

export type ModelId =
  | OpenAIChatModelId
  | AnthropicMessagesModelId
  | GoogleGenerativeAIModelId;
