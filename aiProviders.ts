export enum aiProvider {
  BEDROCK = "BEDROCK",
  ANTHROPIC = "ANTHROPIC",
  OPENAI = "OPENAI",
}

export const aiProviderKeys: Record<string, string[]> = {
  BEDROCK: ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "AWS_REGION"],
  ANTHROPIC: ["API_KEY"],
  OPENAI: ["API_KEY"],
};
