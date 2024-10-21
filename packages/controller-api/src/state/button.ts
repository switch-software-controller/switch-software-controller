import type { Button } from "../primitives";

/**
 * Represents the state of a buttons.
 */
export interface ButtonState {
  /**
   * The value of the button state.
   */
  get value(): number;

  /**
   * Changes the state of the specified buttons to press.
   *
   * @param buttons
   */
  press(buttons: Button[]): void;

  /**
   * Changes the state of the specified buttons to release.
   *
   * @param buttons
   */
  release(buttons: Button[]): void;

  /**
   * Reset the state.
   */
  reset(): void;
}

