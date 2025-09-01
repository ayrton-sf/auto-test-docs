import { aiProvider, aiProviderKeys } from "./aiProviders";
import { Models } from "./models";
import "dotenv/config";

export class Config {
  public readonly model: string;
  public readonly provider: aiProvider;
  public readonly inputDir: string;
  public readonly outputPath: string;
  public readonly awsSecretAccessKey?: string;
  public readonly awsAccessKeyId?: string;
  public readonly awsRegion?: string;
  public readonly apiKey?: string;
  public readonly dirsToCapitalize?: string[];
  public readonly dirsToKeepJoined?: string[];

  constructor() {
    this.model = this.getRequiredEnvVar("LLM_MODEL");
    this.provider = Models[this.model];
    this.inputDir = this.getRequiredEnvVar("INPUT_DIR");
    this.outputPath = this.getRequiredEnvVar("OUTPUT_PATH");
    this.dirsToCapitalize = this.parseEnvVarArray("DIRS_TO_CAPITALIZE");
    this.dirsToKeepJoined = this.parseEnvVarArray("DIRS_TO_KEEP_JOINED");
    this.setLLMEnvVar(this.provider);
  }

  private setLLMEnvVar(provider: aiProvider) {
    for (const envKey of aiProviderKeys[provider]) {
      const propName = this.envKeyToPropName(envKey);
      (this as Config)[propName] = process.env[envKey];
    }
  }

  private envKeyToPropName(envKey: string): string {
    return envKey
      .toLowerCase()
      .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  private parseEnvVarArray(arrayKey: string): undefined | string[] {
    const envValue = process.env[arrayKey];
    if (!envValue) {
      return undefined;
    } else {
      return envValue
        .split(",")
        .map((dir) => dir.trim())
        .filter((dir) => dir.length > 0);
    }
  }

  private getRequiredEnvVar(name: string): string {
    const value = process.env[name];
    if (!value) throw new Error(`Missing env variable: ${name}`);
    return value;
  }
}
