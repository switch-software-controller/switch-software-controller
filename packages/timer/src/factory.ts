import type { Timer } from "@switch-software-controller/timer-api";
import { TimerImpl } from "./timer";

/* v8 ignore next 3 */
function getSecondsElapsedSinceEpoch() {
  return Math.trunc(Date.now() / 1000);
}

/**
 * Creates a default timer instance.
 *
 * @returns {Timer} A new timer instance.
 */
export function createDefaultTimer(): Timer {
  return new TimerImpl(getSecondsElapsedSinceEpoch);
}
