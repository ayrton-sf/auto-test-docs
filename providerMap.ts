import { Provider } from "./aiProviders";

export const ModelProviderMap: Record<string, Provider> = {
  'gpt-4': Provider.OPENAI,
  'gpt-4o': Provider.BEDROCK,
  'claude-3': Provider.ANTHROPIC,
  'claude-instant': Provider.ANTHROPIC,
};