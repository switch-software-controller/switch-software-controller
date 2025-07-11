import { beforeEach, describe, expect, it, test } from 'vitest';
import { StopwatchImpl } from './stopwatch.ts';

const secondsInMinute = 60;
const secondsInHour = 3600; // 60 * 60
const secondsInDay = 86400; // 60 * 60 * 24

describe(StopwatchImpl, () => {
  describe('elapsedTime', () => {
    let now: (values: number[]) => () => number;

    beforeEach(() => {
      now = (values: number[]) => {
        let index = 0;
        return () => values[index++];
      };
    });

    it('should return default ElapsedTime if not started', () => {
      const stopwatch = new StopwatchImpl(now([]));
      expect(stopwatch.elapsedTime).toEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
    });

    it('should return { seconds: 1 } if started and not stopped', () => {
      const stopwatch = new StopwatchImpl(now([0, 1]));
      stopwatch.start();
      expect(stopwatch.elapsedTime).toEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 1,
      });
    });

    test.each([
      { start: 0, stop: 1, expected: { seconds: 1 } },
      { start: 0, stop: secondsInMinute - 1, expected: { seconds: 59 } },
      { start: 0, stop: secondsInMinute, expected: { minutes: 1 } },
      {
        start: 0,
        stop: secondsInMinute + 1,
        expected: { minutes: 1, seconds: 1 },
      },
      {
        start: 0,
        stop: secondsInHour - 1,
        expected: { minutes: 59, seconds: 59 },
      },
      { start: 0, stop: secondsInHour, expected: { hours: 1 } },
      { start: 0, stop: secondsInHour + 1, expected: { hours: 1, seconds: 1 } },
      {
        start: 0,
        stop: secondsInDay - 1,
        expected: { hours: 23, minutes: 59, seconds: 59 },
      },
      { start: 0, stop: secondsInDay, expected: { days: 1 } },
      { start: 0, stop: secondsInDay + 1, expected: { days: 1, seconds: 1 } },
    ])(
      'should return $expected if start is $start and stop is $stop',
      ({ start, stop, expected }) => {
        const stopwatch = new StopwatchImpl(now([start, stop]));
        stopwatch.start();
        expect(stopwatch.elapsedTime).toEqual({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          ...expected,
        });
      },
    );

    test.each([
      { start: 10, stop: 0, current: 10 + 1, expected: { seconds: 1 } },
      {
        start: 10,
        stop: 0,
        current: secondsInMinute + 10 - 1,
        expected: { seconds: 59 },
      },
      {
        start: 10,
        stop: 0,
        current: secondsInMinute + 10,
        expected: { minutes: 1 },
      },
      {
        start: 10,
        stop: 0,
        current: secondsInMinute + 10 + 1,
        expected: { minutes: 1, seconds: 1 },
      },
      {
        start: 10,
        stop: 0,
        current: secondsInHour + 10 - 1,
        expected: { minutes: 59, seconds: 59 },
      },
      {
        start: 10,
        stop: 0,
        current: secondsInHour + 10,
        expected: { hours: 1 },
      },
      {
        start: 10,
        stop: 0,
        current: secondsInHour + 10 + 1,
        expected: { hours: 1, seconds: 1 },
      },
      {
        start: 10,
        stop: 0,
        current: secondsInDay + 10 - 1,
        expected: { hours: 23, minutes: 59, seconds: 59 },
      },
      { start: 10, stop: 0, current: secondsInDay + 10, expected: { days: 1 } },
      {
        start: 10,
        stop: 0,
        current: secondsInDay + 10 + 1,
        expected: { days: 1, seconds: 1 },
      },
    ])(
      'should return $expected if start is $start, stop is $stop and current is $current',
      ({ start, stop, current, expected }) => {
        const stopwatch = new StopwatchImpl(now([stop, start, current]));
        stopwatch.stop();
        stopwatch.start();
        expect(stopwatch.elapsedTime).toEqual({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          ...expected,
        });
      },
    );
  });
});
