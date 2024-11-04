/**
 * This module defines a set of constants representing hat directions.
 * Each direction is assigned a unique ordered value.
 */
import { Hat } from '@switch-software-controller/controller-api';

/**
 * Represents a hat direction.
 */
export const HatValue = {
  /**
   * Represents the top direction.
   */
  [Hat.Top]: 0,

  /**
   * Represents the top-right direction.
   */
  [Hat.TopRight]: 1,

  /**
   * Represents the right direction.
   */
  [Hat.Right]: 2,

  /**
   * Represents the bottom-right direction.
   */
  [Hat.BottomRight]: 3,

  /**
   * Represents the bottom direction.
   */
  [Hat.Bottom]: 4,

  /**
   * Represents the bottom-left direction.
   */
  [Hat.BottomLeft]: 5,

  /**
   * Represents the left direction.
   */
  [Hat.Left]: 6,

  /**
   * Represents the top-left direction.
   */
  [Hat.TopLeft]: 7,

  /**
   * Represents the neutral direction
   */
  [Hat.Neutral]: 8,
} as const;

/**
 * Represents a hat direction.
 */
export type HatValue = (typeof HatValue)[keyof typeof HatValue];
