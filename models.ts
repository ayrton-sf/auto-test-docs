import { aiProvider } from "./aiProviders";

export const Models: Record<string, aiProvider> = {
  "claude-opus-4-1-20250805": aiProvider.ANTHROPIC,
  "claude-opus-4-20250514": aiProvider.ANTHROPIC,
  "claude-sonnet-4-20250514": aiProvider.ANTHROPIC,
  "claude-3-7-sonnet-latest": aiProvider.ANTHROPIC,
  "anthropic.claude-3-5-sonnet-20240620-v1:0": aiProvider.BEDROCK,
  "anthropic.claude-3-7-sonnet-20250219-v1:0": aiProvider.BEDROCK,
  "anthropic.claude-opus-4-20250514-v1:0": aiProvider.BEDROCK,
  "gpt-5-2025-08-07": aiProvider.OPENAI,
  "gpt-4.1-2025-04-14": aiProvider.OPENAI,
  "gpt-5-nano-2025-08-07": aiProvider.OPENAI,
  "gpt-5-mini-2025-08-07": aiProvider.OPENAI,
};
