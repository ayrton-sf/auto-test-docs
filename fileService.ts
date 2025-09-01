import * as fs from "fs";
import * as path from "path";
import { Config } from "./config";
import { parseImports } from "parse-imports";

export type FileMeta = { summary: string; services: string[] };
export type FileState = Record<string, FileMeta>;

export class FileService {
  private readonly config: Config;
  private state: FileState = {};
  private readonly jsonPath: string;

  constructor(config: Config) {
    this.config = config;
    this.jsonPath = path.join(process.cwd(), "docs.json");
    this.fetchState(this.jsonPath);
  }

  private fetchState(jsonPath: string): void {
    if (fs.existsSync(jsonPath)) {
      const data = fs.readFileSync(jsonPath, "utf-8");
      this.state = JSON.parse(data);
    } else {
      this.state = {};
    }
  }

  public read(filePath: string): string {
    return fs.readFileSync(filePath, "utf-8").trim();
  }

  public save(filePath: string, summary: string, services: string[] = []) {
    this.state[filePath] = { summary, services: [...new Set(services)] };
    fs.writeFileSync(this.jsonPath, JSON.stringify(this.state, null, 2));
  }

  public toDict(files: string[] = []): Record<string, FileMeta> {
    if (files.length > 0) {
      return this.buildMetaDict(files, this.config.inputDir);
    } else {
      return this.scanForFiles(this.config.inputDir);
    }
  }

  private scanForFiles(inputPath: string): Record<string, FileMeta> {
    const scannedDir = this.scanDir(inputPath);

    if (Object.keys(this.state).length === 0) return scannedDir;

    const files: Record<string, FileMeta> = {};
    for (const file of Object.keys(scannedDir)) {
      if (!this.state[file]) files[file] = { summary: "", services: [] };
    }
    return files;
  }

  private buildMetaDict(
    files: string[],
    inputPath: string
  ): Record<string, FileMeta> {
    const dict: Record<string, FileMeta> = {};
    for (const f of files) {
      const relativePath = path
        .relative(inputPath, path.join(inputPath, f))
        .replace(/\\/g, "/");

      dict[relativePath] = {
        summary: "",
        services: [],
      };
    }
    return dict;
  }

  private scanDir(dir: string): Record<string, FileMeta> {
    let scannedDict: Record<string, FileMeta> = {};

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        const nested = this.scanDir(fullPath);
        scannedDict = { ...scannedDict, ...nested };
      } else if (entry.isFile()) {
        const relPath = path
          .relative(this.config.inputDir, fullPath)
          .replace(/\\/g, "/");

        scannedDict[relPath] = { summary: "", services: [] };
      }
    }

    return scannedDict;
  }

  public get stateDict(): FileState {
    return this.state;
  }

  public async scanServices(testFullPath: string): Promise<string[]> {
    const src = this.read(testFullPath);
    const imports = [
      ...(await parseImports(src, { resolveFrom: testFullPath })),
    ];

    const isServiceish = (absPathOrPkg: string) => {
      const norm = absPathOrPkg.replace(/\\/g, "/");
      const file = norm.split("/").pop() || norm;
      return /service(\.|$)/i.test(file);
    };

    const results = new Set<string>();

    for (const im of imports) {
      const spec =
        im.moduleSpecifier?.value ??
        (im.moduleSpecifier?.resolved as string | undefined);
      if (!spec) continue;

      const resolved =
        (im.moduleSpecifier?.resolved as string | undefined) || spec;

      if (resolved.startsWith("/") || /^[A-Za-z]:[\\/]/.test(resolved)) {
        if (!isServiceish(resolved)) continue;
        const base = path.basename(resolved, path.extname(resolved));
        results.add(base);
      } else {
        if (isServiceish(resolved)) {
          const base = path.basename(resolved, path.extname(resolved));
          results.add(base);
        }
      }
    }

    return [...results];
  }
}
