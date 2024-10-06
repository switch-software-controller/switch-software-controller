/**
 * Command information.
 */
export type CommandInfo = {
  /**
   * Command name.
   */
  name: {
    [lang: string]: string;
  };

  /**
   * Command version.
   */
  version: string;

  /**
   * Command description.
   */
  description: {
    [lang: string]: string;
  };

  /**
   * Default language.
   */
  defaultLang: string;
};

/**
 * Command information reader.
 */
export interface CommandInfoReader {
  /**
   * Read command information.
   */
  read(): CommandInfo;
}
