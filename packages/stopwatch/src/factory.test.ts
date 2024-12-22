import { describe, expect, it } from 'vitest';
import { createDefaultStopwatch } from './factory.ts';
import { StopwatchImpl } from './stopwatch.ts';

describe(createDefaultStopwatch, () => {
  it('should returns a Stopwatch instance', () => {
    const stopwatch = createDefaultStopwatch();
    expect(stopwatch).toBeInstanceOf(StopwatchImpl);
  });
});
