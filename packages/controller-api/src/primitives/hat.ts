/**
 * This module defines a set of constants representing hat directions.
 * Each direction is assigned a unique ordered value.
 */

/**
 * Represents a hat direction.
 */
export const Hat = {
  /**
   * Represents the top direction.
   */
  Top: 0,

  /**
   * Represents the top-right direction.
   */
  TopRight: 1,

  /**
   * Represents the right direction.
   */
  Right: 2,

  /**
   * Represents the bottom-right direction.
   */
  BottomRight: 3,

  /**
   * Represents the bottom direction.
   */
  Bottom: 4,

  /**
   * Represents the bottom-left direction.
   */
  BottomLeft: 5,

  /**
   * Represents the left direction.
   */
  Left: 6,

  /**
   * Represents the top-left direction.
   */
  TopLeft: 7,

  /**
   * Represents the neutral direction
   */
  Neutral: 8,
} as const;

/**
 * Represents a hat direction.
 */
export type Hat = (typeof Hat)[keyof typeof Hat];
