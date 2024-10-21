import type { Lang } from "./lang.ts";

/**
 * Command information.
 */
export type CommandInfo = {
  /**
   * Command name.
   */
  name: {
    [lang in Lang]: string;
  };

  /**
   * Command version.
   */
  version: string;

  /**
   * Command description.
   */
  description: {
    [lang in Lang]: string;
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
