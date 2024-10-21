/**
 * Logger interface
 */
export interface Logger {
  /**
   * Log a debug message
   *
   * @param message
   */
  debug(message: string): void;

  /**
   * Log an info message
   *
   * @param message
   */
  info(message: string): void;

  /**
   * Log a warning message
   *
   * @param message
   */
  warn(message: string): void;

  /**
   * Log an error message
   *
   * @param message
   */
  error(message: string): void;
}
