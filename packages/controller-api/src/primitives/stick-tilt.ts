/**
 * This module defines the StickTiltRange, Angle, Modulus, and StickTilt classes,
 * as well as the StickTiltPreset constants. These are used to represent and manipulate
 * the tilt of a joystick or similar input device.
 */

/**
 * Defines the range of possible values for the tilt of a joystick.
 */
export const StickTiltRange = {
  /** The minimum tilt value (0). */
  Min: 0,

  /** The center tilt value (128). */
  Center: 128,

  /** The maximum tilt value (255). */
  Max: 255,
} as const;
/**
 * Represents the range of possible values for the tilt of a joystick.
 */
export type StickTiltRange =
  (typeof StickTiltRange)[keyof typeof StickTiltRange];

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
export type StickTiltPreset = (typeof StickTiltPreset)[keyof typeof StickTiltPreset];
