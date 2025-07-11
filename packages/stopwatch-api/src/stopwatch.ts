import type { ElapsedTime } from './elapsed-time.ts';

/**
 * A stopwatch that can be started and stopped to measure elapsed time.
 */
export interface Stopwatch {
  /**
   * The elapsed time since the stopwatch was started.
   * If the stopwatch is not running, the elapsed time is 0.
   * If there is no valid stopped-time, it returns the elapsed time up to the current time.
   */
  readonly elapsedTime: ElapsedTime;

  /**
   * Starts the stopwatch.
   */
  start(): void;

  /**
   * Stops the stopwatch.
   */
  stop(): void;
}
