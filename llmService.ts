import { ChatBedrockConverse } from "@langchain/aws";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ChatAnthropic } from "@langchain/anthropic";
import { StringOutputParser } from "@langchain/core/output_parsers";
import * as fs from "fs";
import { Config } from "./config";

enum Prompts {
  SUMMARIZE_TEST = "./summarize_file.txt",
}

export class LLMService {
  private readonly config: Config;
  constructor(config: Config) {
    this.config = config;
  }

  private selectLanguageModel(): BaseChatModel {
    const llmFactory = {
      BEDROCK: () =>
        new ChatBedrockConverse({
          model: this.config.model,
          region: this.config.awsRegion,
          credentials: {
            accessKeyId: this.config.awsAccessKeyId as string,
            secretAccessKey: this.config.awsSecretAccessKey as string,
          },
        }),
    };

    return llmFactory[this.config.provider]();
  }

  private loadPrompt(promptPath: string): string {
    return fs.readFileSync(promptPath, "utf-8").trim();
  }

  public createAIChain(promptPath: string): any {
    const llm = this.selectLanguageModel();
    const promptTemplate = ChatPromptTemplate.fromTemplate(
      this.loadPrompt(promptPath)
    );
    const outputParser = new StringOutputParser();

    return promptTemplate.pipe(llm).pipe(outputParser);
  }

  public async summarize(fileContent: string): Promise<any> {
    const chain = this.createAIChain(Prompts.SUMMARIZE_TEST);

    return chain.invoke({ content: fileContent });
  }
}
