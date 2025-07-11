import type { StickTilt, StickTiltPreset } from '../primitives';

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
