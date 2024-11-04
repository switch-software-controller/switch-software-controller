import {
  type StickTilt,
  StickTiltPreset,
} from '@switch-software-controller/controller-api';

export const StickTiltRange = {
  Min: 0,
  Center: 128,
  Max: 255,
} as const;
export type StickTiltRange =
  (typeof StickTiltRange)[keyof typeof StickTiltRange];

export class StickTiltImpl implements StickTilt {
  readonly x: number;
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
    const mod = this.normalizeModulus(modulus);
    if (mod === 0.0) {
      this.x = StickTiltRange.Center;
      this.y = StickTiltRange.Center;
    } else {
      const xy = this.calculateXY(angle, mod);
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
  private normalizeModulus(modulus: number): number {
    return Math.max(0.0, Math.min(modulus, 1.0));
  }

  /**
   * Calculates the x and y coordinates for the specified angle and modulus.
   *
   * @private
   */
  private calculateXY(
    degrees: number,
    modulus: number,
  ): { x: number; y: number } {
    const maxRange = StickTiltRange.Max;
    const rad = this.radiansFrom(degrees);
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
  private radiansFrom(degrees: number): number {
    return (degrees * Math.PI) / 180.0;
  }
}

/**
 * Preset StickTilt instances for common joystick tilt values.
 */
export const StickTiltPresetDefault = {
  [StickTiltPreset.Neutral]: new StickTiltImpl({ angle: 0.0, modulus: 0.0 }),
  [StickTiltPreset.Right]: new StickTiltImpl({ angle: 0.0 }),
  [StickTiltPreset.TopRight]: new StickTiltImpl({ angle: 45.0 }),
  [StickTiltPreset.Top]: new StickTiltImpl({ angle: 90.0 }),
  [StickTiltPreset.TopLeft]: new StickTiltImpl({ angle: 135.0 }),
  [StickTiltPreset.Left]: new StickTiltImpl({ angle: 180.0 }),
  [StickTiltPreset.BottomLeft]: new StickTiltImpl({ angle: 225.0 }),
  [StickTiltPreset.Bottom]: new StickTiltImpl({ angle: 270.0 }),
  [StickTiltPreset.BottomRight]: new StickTiltImpl({ angle: 315.0 }),
} as const;
export type StickTiltPresetDefault =
  (typeof StickTiltPresetDefault)[keyof typeof StickTiltPresetDefault];
