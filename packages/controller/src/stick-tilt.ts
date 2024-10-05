export const StickTiltRange = {
  Min: 0,
  Center: 128,
  Max: 255,
} as const;
export type StickTiltRange =
  (typeof StickTiltRange)[keyof typeof StickTiltRange];

class Angle {
  constructor(public value: number) {
    this.value = value % 360;
  }

  toRadians(): number {
    return (this.value * Math.PI) / 180.0;
  }

  static of(value: number): Angle {
    return new Angle(value);
  }
}

class Modulus {
  constructor(public value: number) {
    this.value = Modulus.normalize(value);
  }

  static normalize(value?: number): number {
    if (!value) {
      return 1.0;
    }
    return Math.max(0.0, Math.min(value, 1.0));
  }
}

export class StickTilt {
  x: number;
  y: number;

  constructor({
    angle,
    modulus = 1.0,
  }: {
    angle: number;
    modulus?: number;
  }) {
    const mod = Modulus.normalize(modulus);
    if (mod === 0.0) {
      const center = StickTiltRange.Center;
      this.x = center;
      this.y = center;
    } else {
      const xy = StickTilt.calculateXY(angle, mod);
      this.x = xy.x;
      this.y = xy.y;
    }
  }

  private static calculateXY(
    angle: number,
    modulus: number,
  ): { x: number; y: number } {
    const maxRange = StickTiltRange.Max;
    const rad = Angle.of(angle).toRadians();
    return {
      x: Math.ceil(127.5 * Math.cos(rad) * modulus + 127.5),
      y: maxRange - Math.ceil(127.5 * Math.sin(rad) * modulus + 127.5),
    };
  }
}

export const StickTiltPreset = {
  Center: new StickTilt({ angle: 0.0, modulus: 0.0 }),
  Right: new StickTilt({ angle: 0.0 }),
  TopRight: new StickTilt({ angle: 45.0 }),
  Top: new StickTilt({ angle: 90.0 }),
  TopLeft: new StickTilt({ angle: 135.0 }),
  Left: new StickTilt({ angle: 180.0 }),
  BottomLeft: new StickTilt({ angle: 225.0 }),
  Bottom: new StickTilt({ angle: 270.0 }),
  BottomRight: new StickTilt({ angle: 315.0 }),
} as const;
export type StickTiltPreset =
  (typeof StickTiltPreset)[keyof typeof StickTiltPreset];
