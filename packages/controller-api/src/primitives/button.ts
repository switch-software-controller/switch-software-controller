/**
 * This module defines a set of constants representing button values.
 */

/**
 * Represents a set of button values.
 */
export const Button = {
  /**
   * Represents no button.
   */
  Noop: 0,

  /**
   * Represents the Y button.
   */
  Y: 1,

  /**
   * Represents the X button.
   */
  B: 2,

  /**
   * Represents the A button.
   */
  A: 3,

  /**
   * Represents the X button.
   */
  X: 4,

  /**
   * Represents the L button.
   */
  L: 5,

  /**
   * Represents the R button.
   */
  R: 6,

  /**
   * Represents the ZL button.
   */
  ZL: 7,

  /**
   * Represents the ZR button.
   */
  ZR: 8,

  /**
   * Represents the minus button.
   */
  Minus: 9,

  /**
   * Represents the plus button.
   */
  Plus: 10,

  /**
   * Represents the LStick button.
   */
  LStick: 11,

  /**
   * Represents the RStick button
   */
  RStick: 12,

  /**
   * Represents the home button.
   */
  Home: 13,

  /**
   * Represents the capture button.
   */
  Capture: 14,
} as const;

/**
 * Represents a button value.
 */
export type Button = (typeof Button)[keyof typeof Button];
