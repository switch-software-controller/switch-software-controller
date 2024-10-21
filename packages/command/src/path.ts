import type { CommandPath } from "@switch-software-controller/command-api";
import {
  type PathJoiner,
  normalizeFileName,
} from "@switch-software-controller/path-utils";

/**
 * An implementation of the CommandPath interface.
 */
export class CommandPathImpl implements CommandPath {
  readonly root: string;
  private _defaultImageExtension = "png";

  constructor(
    commandsRoot: string,
    readonly commandName: string,
    private readonly join: PathJoiner,
  ) {
    this.root = join(commandsRoot, commandName);
  }

  get defaultImageExtension() {
    return this._defaultImageExtension;
  }

  set defaultImageExtension(extension: string) {
    if (
      extension !== undefined &&
      extension !== null &&
      extension.trim().length > 0
    ) {
      this._defaultImageExtension = extension;
    }
  }

  get command() {
    return this.join(this.root, "src", "index.ts");
  }

  get info() {
    return this.join(this.root, "info.json");
  }

  get templates() {
    return this.join(this.root, "templates");
  }

  get captures() {
    return this.join(this.root, "captures");
  }

  template(fileName: string, extension?: string) {
    return this.join(
      this.templates,
      this.normalizeFileName(fileName, extension),
    );
  }

  capture(fileName?: string, extension?: string) {
    return this.join(
      this.captures,
      this.normalizeFileName(fileName, extension),
    );
  }

  private normalizeFileName(
    fileName?: string,
    extension: string = this.defaultImageExtension,
  ) {
    return normalizeFileName(extension, () => new Date(), fileName);
  }
}
