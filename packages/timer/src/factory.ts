import { type Timer, TimerImpl } from "./timer";

/* v8 ignore start */
function getSecondsElapsedSinceEpoch() {
  return Math.trunc(Date.now() / 1000);
}
/* v8 ignore stop */

/**
 * Creates a default timer instance.
 *
 * @returns {Timer} A new timer instance.
 */
export function createDefaultTimer(): Timer {
  return new TimerImpl(getSecondsElapsedSinceEpoch);
}
