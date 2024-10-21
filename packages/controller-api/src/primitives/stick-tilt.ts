/**
 * Represents the tilt of a joystick.
 */
export interface StickTilt {
  /**
   * The x-coordinate of the tilt.
   */
  readonly x: number;

  /**
   * The y-coordinate of the tilt.
   */
  readonly y: number;
}

/**
 * Preset StickTilt instances for common joystick tilt values.
 */
export const StickTiltPreset = {
  Neutral: 0,
  Right: 1,
  TopRight: 2,
  Top: 3,
  TopLeft: 4,
  Left: 5,
  BottomLeft: 6,
  Bottom: 7,
  BottomRight: 8,
} as const;
export type StickTiltPreset =
  (typeof StickTiltPreset)[keyof typeof StickTiltPreset];
