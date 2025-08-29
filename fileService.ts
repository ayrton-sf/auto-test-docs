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

    if (fs.existsSync(this.jsonPath)) {
      const data = fs.readFileSync(this.jsonPath, "utf-8");
      this.state = JSON.parse(data);
    } else {
      this.state = {};
    }
  }

  public read(filePath: string): string {
    return fs.readFileSync(filePath, "utf-8").trim();
  }

  // now enforces { summary, services } schema
  public save(filePath: string, summary: string, services: string[] = []) {
    this.state[filePath] = { summary, services: [...new Set(services)] };
    fs.writeFileSync(this.jsonPath, JSON.stringify(this.state, null, 2));
  }

  public toDict(files: string[] = []): Record<string, FileMeta> {
    if (files.length > 0) {
      const dict: Record<string, FileMeta> = {};
      for (const f of files) {
        const relativePath = path
          .relative(this.config.inputDir, path.join(this.config.inputDir, f))
          .replace(/\\/g, "/");

        dict[relativePath] = this.state[relativePath] || {
          summary: "",
          services: [],
        };
      }
      return dict;
    }

    const scannedDict: Record<string, FileMeta> = {};
    const scanDir = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanDir(fullPath);
        } else if (entry.isFile()) {
          const relPath = path
            .relative(this.config.inputDir, fullPath)
            .replace(/\\/g, "/");
          scannedDict[relPath] = { summary: "", services: [] };
        }
      }
    };

    scanDir(this.config.inputDir);

    if (Object.keys(this.state).length === 0) return scannedDict;

    const newFiles: Record<string, FileMeta> = {};
    for (const file of Object.keys(scannedDict)) {
      if (!this.state[file]) newFiles[file] = { summary: "", services: [] };
    }
    return newFiles;
  }

  // now returns the full meta (not just summary)
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
