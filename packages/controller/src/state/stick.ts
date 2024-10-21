import type {
  StickState,
  StickTilt,
  StickTiltPreset,
} from "@switch-software-controller/controller-api";
import { StickTiltPresetDefault, StickTiltRange } from "../primitives";

/**
 * Default Implementation of StickState
 */
export class StickStateImpl implements StickState {
  /**
   * `true` if the stick state is dirty; otherwise, false.
   * @private
   */
  private _isDirty = false;

  /**
   * The x-coordinate of the stick state.
   * @private
   */
  private _x: number = StickTiltRange.Center;

  /**
   * The y-coordinate of the stick state.
   * @private
   */
  private _y: number = StickTiltRange.Center;

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  set x(newValue: number) {
    const clamped = this.clamp(newValue);
    if (this._x !== clamped) {
      this._x = clamped;
      this._isDirty = true;
    }
  }

  set y(newValue: number) {
    const clamped = this.clamp(newValue);
    if (this._y !== clamped) {
      this._y = clamped;
      this._isDirty = true;
    }
  }

  set tilt(newTilt: StickTilt) {
    this.x = newTilt.x;
    this.y = newTilt.y;
  }

  set tiltPreset(newTiltPreset: StickTiltPreset) {
    this.tilt = StickTiltPresetDefault[newTiltPreset];
  }

  get isDirty() {
    return this._isDirty;
  }

  reset() {
    this.x = StickTiltRange.Center;
    this.y = StickTiltRange.Center;
  }

  consume() {
    this._isDirty = false;
  }

  /**
   * Clamps the specified value to the range [0, 255].
   * @param value
   * @private
   */
  private clamp(value: number): number {
    return Math.max(StickTiltRange.Min, Math.min(StickTiltRange.Max, value));
  }
}
