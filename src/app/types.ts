import type { AnthropicMessagesModelId } from "@ai-sdk/anthropic/internal";
import type { OpenAIChatModelId } from "@ai-sdk/openai/internal";

export type Provider = "openai" | "anthropic";

export type ModelId = OpenAIChatModelId | AnthropicMessagesModelId;
