import { aiProvider } from "./aiProviders";

export const Models: Record<string, aiProvider> = {
  "anthropic.claude-3-5-sonnet-20240620-v1:0": aiProvider.BEDROCK,
};
