import { Provider } from "./aiProviders";
import { ModelProviderMap } from "./providerMap";
import "dotenv/config";

export class Config {
  public readonly model: string;
  public readonly provider: Provider;
  public readonly inputDir: string;
  public readonly outputPath: string;
  public readonly awsSecretAccessKey?: string;
  public readonly awsAccessKeyId?: string;
  public readonly awsRegion?: string;
  public readonly apiKey?: string;

  constructor() {
    this.model = this.getEnvVar("LLM_MODEL");
    this.provider = ModelProviderMap[this.model];
    this.inputDir = this.getEnvVar("INPUT_DIR");
    this.outputPath = this.getEnvVar("OUTPUT_PATH");

    if (this.provider === Provider.BEDROCK) {
      this.awsAccessKeyId = this.getEnvVar("AWS_ACCESS_KEY_ID");
      this.awsSecretAccessKey = this.getEnvVar("AWS_SECRET_ACCESS_KEY");
      this.awsRegion = this.getEnvVar("AWS_REGION");
    } else {
      this.apiKey = this.getEnvVar("API_KEY");
    }
  }

  private getEnvVar(name: string): string {
    const value = process.env[name];
    if (!value) throw new Error(`Missing env variable: ${name}`);
    return value;
  }
}
