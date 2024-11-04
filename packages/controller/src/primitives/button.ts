/**
 * This module defines a set of constants representing button values.
 */
import { Button } from '@switch-software-controller/controller-api';

/**
 * Represents a set of button values.
 * Each button is assigned a unique bitwise value.
 */
export const ButtonValue = {
  /**
   * Represents no button.
   */
  [Button.Noop]: 0,

  /**
   * Represents the Y button.
   */
  [Button.Y]: 1, // 1 << 0,

  /**
   * Represents the X button.
   */
  [Button.B]: 2, // 1 << 1,

  /**
   * Represents the A button.
   */
  [Button.A]: 4, // 1 << 2,

  /**
   * Represents the X button.
   */
  [Button.X]: 8, // 1 << 3,

  /**
   * Represents the L button.
   */
  [Button.L]: 16, // 1 << 4,

  /**
   * Represents the R button.
   */
  [Button.R]: 32, // 1 << 5,

  /**
   * Represents the ZL button.
   */
  [Button.ZL]: 64, // 1 << 6,

  /**
   * Represents the ZR button.
   */
  [Button.ZR]: 128, // 1 << 7,

  /**
   * Represents the minus button.
   */
  [Button.Minus]: 256, // 1 << 8,

  /**
   * Represents the plus button.
   */
  [Button.Plus]: 512, // 1 << 9,

  /**
   * Represents the LStick button.
   */
  [Button.LStick]: 1024, // 1 << 10,

  /**
   * Represents the RStick button
   */
  [Button.RStick]: 2048, // 1 << 11,

  /**
   * Represents the home button.
   */
  [Button.Home]: 4096, // 1 << 12,

  /**
   * Represents the capture button.
   */
  [Button.Capture]: 8192, // 1 << 13,
} as const;

/**
 * Represents a button value.
 */
export type ButtonValue = (typeof ButtonValue)[keyof typeof ButtonValue];
