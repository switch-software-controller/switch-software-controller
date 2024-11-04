import type { Hat } from '../primitives';

/**
 * Represents the state of a hat.
 */
export interface HatState {
  /**
   * The value of the hat state.
   */
  get value(): Hat;

  /**
   * Changes the state of the hat to press.
   * @param hat
   */
  press(hat: Hat): void;

  /**
   * Reset the state.
   */
  reset(): void;
}
