import type { MacroPath } from '@switch-software-controller/macro-api';
import {
  normalizeFileName,
  type PathJoiner,
} from '@switch-software-controller/path-utils';

/**
 * An implementation of the MacroPath interface.
 */
export class MacroPathImpl implements MacroPath {
  readonly root: string;
  private _defaultImageExtension = 'png';

  constructor(
    macroRoot: string,
    readonly macroName: string,
    private readonly join: PathJoiner,
  ) {
    this.root = join(macroRoot, macroName);
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

  get macro() {
    return this.join(this.root, 'src', 'index.ts');
  }

  get info() {
    return this.join(this.root, 'info.json');
  }

  get templates() {
    return this.join(this.root, 'templates');
  }

  get captures() {
    return this.join(this.root, 'captures');
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
