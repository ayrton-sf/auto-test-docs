import { Provider } from "./aiProviders";
import { ModelProviderMap } from "./providerMap";

export class Config {
  public readonly model: string;
  public readonly testsDir: string;
  public readonly targetPath: string;
  public readonly awsSecretAccessKey: string;
  public readonly awsAccessKeyId: string;
  public readonly provider: string;
  public readonly awsRegion: string;

  constructor() {
    this.model = this.get("LLM_MODEL");
    this.testsDir = this.get("TESTS_DIR");
    this.targetPath = this.get("TARGET_PATH");
    this.awsSecretAccessKey = this.get("AWS_SECRET_ACCESS_KEY");
    this.awsAccessKeyId = this.get("AWS_ACCESS_KEY_ID");
    this.provider = ModelProviderMap[this.model];
    this.awsRegion = this.getRegion("AWS_REGION");
  }

  private get(envVar: string): string {
    const value = process.env[envVar];
    if (!value) throw new Error(`Missing env variable ${envVar}`);
    return value;
  }

  private getRegion(regionVarKey: string): string  {
    try {
        return this.provider === Provider.BEDROCK ? this.get(regionVarKey) : ""
    } catch {
        return ""
    }
  }
}