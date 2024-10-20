import type { Button, Hat, StickTilt, StickTiltPreset } from "./primitives";

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

/**
 * Represents the state of a stick.
 */
export interface StickState {
  /**
   * The x-coordinate of the stick state.
   */
  x: number;

  /**
   * The y-coordinate of the stick state.
   */
  y: number;

  /**
   * `true` if the stick state is dirty; otherwise, false.
   */
  readonly isDirty: boolean;

  /**
   * Changes the x, y by tilt.
   *
   * @param newTilt
   */
  set tilt(newTilt: StickTilt);

  /**
   * Changes the x, y by StickTiltPreset.
   *
   * @param newTiltPreset
   */
  set tiltPreset(newTiltPreset: StickTiltPreset);

  /**
   * Changes the tilt of the stick state to neutral.(x: ```StickTiltRange.Center```, y: ```StickTiltRange.Center```)
   * And sets the stick state to dirty if the stick state is changed.
   */
  reset(): void;

  /**
   * Sets the stick state to clean.
   * Use this method after consuming the stick state.
   */
  consume(): void;
}

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

  /**
   * Serializes the controller state to a string.
   */
  serialize(): string;
}

/**
 * Represents a state serializer.
 * The state serializer serializes the controller state to a string.
 */
export interface StateSerializer {
  /**
   * Serializes the controller state to a string.
   * @param state
   */
  serialize(state: ControllerState): string;
}
