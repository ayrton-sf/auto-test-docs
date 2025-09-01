export enum aiProvider {
  BEDROCK = "BEDROCK",
}

export const aiProviderKeys: Record<string, string[]> = {
  BEDROCK: ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "AWS_REGION"],
};
