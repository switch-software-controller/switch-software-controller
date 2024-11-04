import type { Lang } from './lang.ts';

/**
 * Macro information.
 */
export type MacroInfo = {
  /**
   * Macro name.
   */
  name: {
    [lang in Lang]: string;
  };

  /**
   * Macro version.
   */
  version: string;

  /**
   * Macro description.
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
 * Macro information reader.
 */
export interface CommandInfoReader {
  /**
   * Read macro information.
   */
  read(): MacroInfo;
}
