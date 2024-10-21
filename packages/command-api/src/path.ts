/**
 * An interface for retrieving the path used by the command.
 */
export interface CommandPath {
  /**
   * Default image extension for `capture` and `template` methods.
   */
  defaultImageExtension: string;

  /**
   * Root path.
   */
  get root(): string;

  get command(): string;

  /**
   * Command Info path.
   */
  get info(): string;

  /**
   * Templates path.
   */
  get templates(): string;

  /**
   * Captures path.
   */
  get captures(): string;

  /**
   * Get the path to a template file.
   *
   * @param fileName
   * @param extension
   */
  template(fileName: string, extension?: string): string;

  /**
   * Get the path to a capture file.
   * When no file name is provided, a file name is generated.
   *
   * @param fileName
   * @param extension
   */
  capture(fileName?: string, extension?: string): string;
}
