import type { ElapsedTime, Timer } from "@switch-software-controller/timer-api";

const secondsInMinute = 60;
const secondsInHour = 3600; // 60 * 60
const secondsInDay = 86400; // 60 * 60 * 24
const minutesInHour = 60;
const hoursInDay = 24;

export class TimerImpl implements Timer {
  private startTime: number | null = null;
  private stopTime: number | null = null;

  constructor(private readonly now: () => number) {}

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
