import * as fs from "fs";
import * as path from "path";
import { Config } from "./config";

export class MarkdownService {
  private readonly config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  public save(files: Record<string, string>) {
    const folderMap: Record<string, { file: string; summary: string }[]> = {};

    for (const [filePath, summary] of Object.entries(files)) {
      const parts = filePath.split("/");
      const topFolder = parts[0];
      const fileName = parts[parts.length - 1];

      if (!folderMap[topFolder]) {
        folderMap[topFolder] = [];
      }

      folderMap[topFolder].push({ file: fileName, summary });
    }

    let markdownContent = "";
    for (const [folder, tests] of Object.entries(folderMap)) {
      markdownContent += `# ${folder}\n\n`;

      for (const test of tests) {
        markdownContent += `## ${test.file}\n\n`;
        markdownContent += `${test.summary}\n\n`;
      }
    }

    const markdownPath = path.join(this.config.outputPath, "documentation.md");
    fs.writeFileSync(markdownPath, markdownContent, "utf-8");
    console.log(`Markdown documentation saved to ${markdownPath}`);
  }
}
