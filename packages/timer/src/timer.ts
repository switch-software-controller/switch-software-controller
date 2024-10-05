import type { ElapsedTime } from "./elapsed-time.ts";

const secondsInMinute = 60;
const secondsInHour = 3600; // 60 * 60
const secondsInDay = 86400; // 60 * 60 * 24
const minutesInHour = 60;
const hoursInDay = 24;

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

/**
 * A default implementation of the `Timer` interface.
 */
export class TimerImpl implements Timer {
  private startTime: number | null = null;
  private stopTime: number | null = null;

  /**
   * Creates a new `TimerImpl` instance.
   *
   * @param now A function that returns the current time in seconds since the Unix epoch.
   */
  constructor(private readonly now: () => number) {}

  /**
   * Starts the timer.
   */
  start() {
    this.startTime = this.now();
  }

  stop() {
    this.stopTime = this.now();
  }

  get elapsedTime(): ElapsedTime {
    if (this.startTime === null) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const startTime = this.startTime;
    const stopTime = this.stopTime ?? this.now();
    const endTime = stopTime >= startTime ? stopTime : this.now();

    const elapsed = endTime - startTime;

    const seconds = elapsed % secondsInMinute;
    const minutes =
      Math.trunc((elapsed - seconds) / secondsInMinute) % minutesInHour;
    const hours =
      Math.trunc(
        (elapsed - (minutes * secondsInMinute + seconds)) / secondsInHour,
      ) % hoursInDay;
    const days = Math.trunc(
      (elapsed -
        (hours * secondsInHour + minutes * secondsInMinute + seconds)) /
        secondsInDay,
    );

    return { days, hours, minutes, seconds };
  }
}
