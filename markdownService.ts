import * as fs from "fs";
import * as path from "path";
import { Config } from "./config";

type SummaryWithServices = { summary: string; services: string[] };
type FileEntry = SummaryWithServices;

export class MarkdownService {
  private readonly config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  private splitCamelCase(str: string): string {
    return str
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .trim();
  }

  private getCapSet(): Set<string> {
    return new Set(
      (this.config.dirsToCapitalize ?? []).map((s) => s.toLowerCase())
    );
  }

  private getKeepJoinedSet(): Set<string> {
    return new Set(
      (this.config.dirsToKeepJoined ?? []).map((s) => s.toLowerCase())
    );
  }

  private mergeKeepJoinedTokens(tokens: string[]): string[] {
    const keepSet = this.getKeepJoinedSet();
    if (keepSet.size === 0 || tokens.length <= 1) return tokens;

    const out: string[] = [];
    for (let i = 0; i < tokens.length; i++) {
      let merged: string | null = null;
      let endIndex = i + 1;
      for (let j = tokens.length; j > i; j--) {
        const candidate = tokens.slice(i, j).join("").toLowerCase();
        if (keepSet.has(candidate)) {
          merged = tokens.slice(i, j).join("");
          endIndex = j;
          break;
        }
      }
      if (merged) {
        out.push(merged);
        i = endIndex - 1;
      } else {
        out.push(tokens[i]);
      }
    }
    return out;
  }

  private formatWord(word: string): string {
    const capSet = this.getCapSet();
    const keepSet = this.getKeepJoinedSet();
    const lower = word.toLowerCase();

    if (capSet.has(lower)) return word.toUpperCase();
    if (keepSet.has(lower)) return word.charAt(0).toUpperCase() + word.slice(1);
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }

  private formatFolderName(folderName: string): string {
    const split = this.splitCamelCase(folderName).split(/\s+/).filter(Boolean);
    const merged = this.mergeKeepJoinedTokens(split);
    const processed = merged.map((w) => this.formatWord(w));
    return processed.join(" ");
  }

  public save(files: Record<string, FileEntry>) {
    const folderMap: Record<
      string,
      { file: string; summary: string; services: string[] }[]
    > = {};

    for (const [filePath, entry] of Object.entries(files)) {
      const parts = filePath.split("/");
      const topFolder = parts[0];
      const fileName = parts[parts.length - 1];

      if (!folderMap[topFolder]) folderMap[topFolder] = [];

      if (typeof entry === "string") {
        folderMap[topFolder].push({
          file: fileName,
          summary: entry,
          services: [],
        });
      } else {
        folderMap[topFolder].push({
          file: fileName,
          summary: entry.summary ?? "",
          services: Array.isArray(entry.services) ? entry.services : [],
        });
      }
    }

    let markdownContent = "";
    for (const [folder, tests] of Object.entries(folderMap)) {
      const formattedFolderName = this.formatFolderName(folder);
      markdownContent += `# ${formattedFolderName}\n\n`;

      for (const test of tests) {
        markdownContent += `### ${test.file}\n\n`;
        if (test.services.length > 0) {
          markdownContent += `**Services used:** ${test.services.join(
            ", "
          )}\n\n`;
        }
        markdownContent += `${test.summary}\n\n`;
      }
    }

    const markdownPath = path.join(this.config.outputPath, "documentation.md");
    fs.writeFileSync(markdownPath, markdownContent, "utf-8");
    console.log(`Markdown documentation saved to ${markdownPath}`);
  }
}
