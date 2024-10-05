/**
 * This module defines a set of constants representing button values.
 */

/**
 * Represents a set of button values.
 * Each button is assigned a unique bitwise value.
 */
export const Button = {
  /**
   * Represents no button.
   */
  Noop: 0,

  /**
   * Represents the Y button.
   */
  Y: 1, // 1 << 0,

  /**
   * Represents the X button.
   */
  B: 2, // 1 << 1,

  /**
   * Represents the A button.
   */
  A: 4, // 1 << 2,

  /**
   * Represents the X button.
   */
  X: 8, // 1 << 3,

  /**
   * Represents the L button.
   */
  L: 16, // 1 << 4,

  /**
   * Represents the R button.
   */
  R: 32, // 1 << 5,

  /**
   * Represents the ZL button.
   */
  ZL: 64, // 1 << 6,

  /**
   * Represents the ZR button.
   */
  ZR: 128, // 1 << 7,

  /**
   * Represents the minus button.
   */
  Minus: 256, // 1 << 8,

  /**
   * Represents the plus button.
   */
  Plus: 512, // 1 << 9,

  /**
   * Represents the LStick button.
   */
  LStick: 1024, // 1 << 10,

  /**
   * Represents the RStick button
   */
  RStick: 2048, // 1 << 11,

  /**
   * Represents the home button.
   */
  Home: 4096, // 1 << 12,

  /**
   * Represents the capture button.
   */
  Capture: 8192, // 1 << 13,
} as const;

/**
 * Represents a button value.
 */
export type Button = (typeof Button)[keyof typeof Button];
