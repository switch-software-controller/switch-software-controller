import type { ButtonState } from './button.ts';
import type { HatState } from './hat.ts';
import type { StickState } from './stick.ts';

/**
 * Represents the state of a controller.
 */
export interface ControllerState {
  /**
   * The state of the buttons.
   */
  readonly buttons: ButtonState;

  /**
   * The state of the hat.
   */
  readonly hat: HatState;

  /**
   * The state of the left stick.
   */
  readonly lStick: StickState;

  /**
   * The state of the right stick.
   */
  readonly rStick: StickState;

  /**
   * `true` if the controller stick state is dirty; otherwise, false.
   */
  readonly isDirty: boolean;

  /**
   * Changes the state to release all buttons, hat, and sticks.
   */
  reset(): void;

  /**
   * Changes the state to clean the stick state.
   * Use this method after consuming the stick state.
   */
  consumeSticks(): void;
}
