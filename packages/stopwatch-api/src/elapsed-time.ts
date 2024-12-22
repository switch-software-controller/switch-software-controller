/**
 * An interface that represents the elapsed time from a specific point in time.
 *
 */
export type ElapsedTime = {
  /**
   * The number of days elapsed since a specific point in time.
   */
  days: number;

  /**
   * The number of hours elapsed since a specific point in time.
   * Elapsed time exceeding 1 day is rolled up into the `days` property.
   */
  hours: number;

  /**
   * The number of minutes elapsed since a specific point in time.
   * Elapsed time exceeding 1 hour is rolled up into the `hours` property and the `days` property.
   */
  minutes: number;

  /**
   * The number of seconds elapsed since a specific point in time.
   * Elapsed time exceeding 1 minute is rolled up into the `minutes`, `hours`, and `days` properties.
   */
  seconds: number;
};
