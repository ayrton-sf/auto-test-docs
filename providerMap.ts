import { Provider } from "./aiProviders";

export const ModelProviderMap: Record<string, Provider> = {
  "anthropic.claude-3-5-sonnet-20240620-v1:0": Provider.BEDROCK,
};
