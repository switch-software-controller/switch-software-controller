import type { Stopwatch } from '@switch-software-controller/stopwatch-api';
import { StopwatchImpl } from './stopwatch.ts';

/* v8 ignore start */
function getSecondsElapsedSinceEpoch() {
  return Math.trunc(Date.now() / 1000);
}
/* v8 ignore stop */

/**
 * Creates a default stopwatch instance.
 *
 * @returns {Stopwatch} A new stopwatch instance.
 */
export function createDefaultStopwatch(): Stopwatch {
  return new StopwatchImpl(getSecondsElapsedSinceEpoch);
}
