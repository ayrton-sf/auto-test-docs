import * as path from "path";
import { Config } from "./config";
import { MarkdownService } from "./markdownService";
import { LLMService } from "./llmService";
import { FileService } from "./fileService";

const config = new Config();
const markdownService = new MarkdownService(config);
const llmService = new LLMService(config);
const fileService = new FileService(config);

const args = process.argv.slice(2);
const isUpdate = args.length > 0;
const specifiedFiles = args;

let files: Record<string, string>;
if (isUpdate) {
  files = fileService.toDict(specifiedFiles);
} else {
  files = fileService.toDict();
}

(async () => {
  for (const [file, desc] of Object.entries(files)) {
    const fullPath = path.join(config.inputDir, file);
    console.log("Processing: ", file);
    const summary = await llmService.summarize(fileService.read(fullPath));
    fileService.save(file, summary);
  }

  markdownService.save(fileService.stateDict);
})();
