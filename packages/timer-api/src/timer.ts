import type { ElapsedTime } from "./elapsed-time.ts";

/**
 * A timer that can be started and stopped to measure elapsed time.
 */
export interface Timer {
  /**
   * The elapsed time since the timer was started.
   * If the timer is not running, the elapsed time is 0.
   * If there is no valid stopped-time, it returns the elapsed time up to the current time.
   */
  readonly elapsedTime: ElapsedTime;

  /**
   * Starts the timer.
   */
  start(): void;

  /**
   * Stops the timer.
   */
  stop(): void;
}
