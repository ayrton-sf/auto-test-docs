import * as fs from "fs";
import * as path from "path";
import { Config } from "./config";

export type FileDict = Record<string, string>;

export class FileService {
  private readonly config: Config;
  private state: FileDict = {};
  private readonly jsonPath: string;

  constructor(config: Config) {
    this.config = config;
    this.jsonPath = path.join(process.cwd(), "docs.json");

    if (fs.existsSync(this.jsonPath)) {
      try {
        const data = fs.readFileSync(this.jsonPath, "utf-8");
        this.state = JSON.parse(data);
      } catch (e) {
        console.warn("Failed to load existing JSON, starting with empty state.", e);
        this.state = {};
      }
    } else {
      this.state = {};
    }
  }

  public save(filePath: string, summary: string) {
    this.state[filePath] = summary;
    fs.writeFileSync(this.jsonPath, JSON.stringify(this.state, null, 2));
  }

  public toDict(files: string[] = []): FileDict {
    if (files.length > 0) {
      const dict: FileDict = {};
      for (const f of files) {
        const relativePath = path.relative(this.config.testsDir, path.join(this.config.testsDir, f));
        dict[relativePath] = this.state[relativePath] || "";
      }
      return dict;
    }

    const scannedDict: FileDict = {};
    const scanDir = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanDir(fullPath);
        } else if (entry.isFile()) {
          const relPath = path.relative(this.config.testsDir, fullPath).replace(/\\/g, "/");
          scannedDict[relPath] = "";
        }
      }
    };

    scanDir(this.config.testsDir);

    if (Object.keys(this.state).length === 0) {
      return scannedDict;
    }

    const newFiles: FileDict = {};
    for (const [file, _] of Object.entries(scannedDict)) {
      if (!this.state[file]) newFiles[file] = "";
    }

    return newFiles;
  }

  public get stateDict(): FileDict {
    return this.state;
  }
}