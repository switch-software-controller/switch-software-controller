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
export class StickTilt {
  /**
   * The x-coordinate of the tilt.
   */
  readonly x: number;

  /**
   * The y-coordinate of the tilt.
   */
  readonly y: number;

  /**
   * Creates a new StickTilt instance with the specified angle and modulus.
   *
   * @param angle The angle in degrees.
   * @param modulus The modulus value in the range [0, 1].
   */
  constructor({
    angle,
    modulus = 1.0,
  }: {
    angle: number;
    modulus?: number;
  }) {
    const mod = StickTilt.normalizeModulus(modulus);
    if (mod === 0.0) {
      this.x = StickTiltRange.Center;
      this.y = StickTiltRange.Center;
    } else {
      const xy = StickTilt.calculateXY(angle, mod);
      this.x = xy.x;
      this.y = xy.y;
    }
  }

  /**
   * Normalizes the specified modulus to the range [0, 1].
   *
   * @private
   * @param modulus The value to normalize.
   * @returns The normalized modulus.
   */
  private static normalizeModulus(modulus: number): number {
    return Math.max(0.0, Math.min(modulus, 1.0));
  }

  /**
   * Calculates the x and y coordinates for the specified angle and modulus.
   *
   * @private
   */
  private static calculateXY(
    degrees: number,
    modulus: number,
  ): { x: number; y: number } {
    const maxRange = StickTiltRange.Max;
    const rad = StickTilt.radiansFrom(degrees);
    return {
      x: Math.ceil(127.5 * Math.cos(rad) * modulus + 127.5),
      y: maxRange - Math.ceil(127.5 * Math.sin(rad) * modulus + 127.5),
    };
  }

  /**
   * Converts the specified angle in degrees to radians.
   * @param degrees
   * @private
   */
  private static radiansFrom(degrees: number): number {
    return (degrees * Math.PI) / 180.0;
  }
}

/**
 * Preset StickTilt instances for common joystick tilt values.
 */
export const StickTiltPreset = {
  Neutral: new StickTilt({ angle: 0.0, modulus: 0.0 }),
  Right: new StickTilt({ angle: 0.0 }),
  TopRight: new StickTilt({ angle: 45.0 }),
  Top: new StickTilt({ angle: 90.0 }),
  TopLeft: new StickTilt({ angle: 135.0 }),
  Left: new StickTilt({ angle: 180.0 }),
  BottomLeft: new StickTilt({ angle: 225.0 }),
  Bottom: new StickTilt({ angle: 270.0 }),
  BottomRight: new StickTilt({ angle: 315.0 }),
} as const;
/**
 * Represents a preset StickTilt instance for common joystick tilt values.
 */
export type StickTiltPreset =
  (typeof StickTiltPreset)[keyof typeof StickTiltPreset];
