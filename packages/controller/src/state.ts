import {
  Button,
  type ButtonState,
  type ControllerState,
  Hat,
  type HatState,
  type StateSerializer,
  type StickState,
  type StickTilt,
  type StickTiltPreset,
  StickTiltRange,
} from "@switch-software-controller/controller-api";
import { StickTiltPresetDefault } from "./stick-tilt.ts";

/**
 * Default Implementation of ButtonState
 */
class ButtonStateImpl implements ButtonState {
  /**
   * The value of the button state.
   * @private
   */
  private _value: number = Button.Noop;

  /**
   * Creates a new button state with the specified buttons.
   *
   * @param buttons The buttons to hold.
   */
  constructor(buttons: Button[] = []) {
    this.press(buttons);
  }

  get value() {
    return this._value;
  }

  press(buttons: Button[]) {
    this._value = buttons.reduce(
      (prev, current) => prev | current,
      this._value,
    );
  }

  release(buttons: Button[]) {
    this._value = buttons.reduce(
      (prev, current) => prev & ~current,
      this._value,
    );
  }

  reset() {
    this._value = Button.Noop;
  }
}

/**
 * Default Implementation of HatState
 */
class HatStateImpl implements HatState {
  /**
   * The value of the hat state.
   * @private
   */
  private _value: Hat;

  /**
   * Creates a new hat state with the specified hat.
   * @param hat
   */
  constructor(hat: Hat = Hat.Neutral) {
    this._value = hat;
  }

  get value() {
    return this._value;
  }

  press(hat: Hat) {
    this._value = hat;
  }

  reset() {
    this._value = Hat.Neutral;
  }
}

/**
 * Default Implementation of StickState
 */
class StickStateImpl implements StickState {
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
    return Math.max(0, Math.min(255, value));
  }
}

export class ControllerStateImpl implements ControllerState {
  /**
   * Creates a new controller state with the specified buttons, hat, left stick, and right stick.
   *
   * @param serializer The StateSerializer to serialize the controller state.
   * @param buttons The State of the buttons.
   * @param hat The State of the hat.
   * @param lStick The State of the left stick.
   * @param rStick The State of the right stick.
   */
  constructor(
    private readonly serializer: StateSerializer = new StateSerializerImpl(),
    readonly buttons = new ButtonStateImpl(),
    readonly hat = new HatStateImpl(),
    readonly lStick = new StickStateImpl(),
    readonly rStick = new StickStateImpl(),
  ) {}

  get isDirty() {
    return this.lStick.isDirty || this.rStick.isDirty;
  }

  reset() {
    this.buttons.reset();
    this.hat.reset();
    this.lStick.reset();
    this.rStick.reset();
  }

  consumeSticks() {
    this.lStick.consume();
    this.rStick.consume();
  }

  serialize() {
    return this.serializer.serialize(this);
  }
}

/**
 * Default Implementation of StateSerializer
 */
export class StateSerializerImpl implements StateSerializer {
  serialize(state: ControllerState): string {
    const hex = (n: number) => {
      return Number(n).toString(16);
    };

    let strL = "";
    let strR = "";

    let flag = state.buttons.value << 2;
    if (state.lStick.isDirty) {
      flag |= 0x2;
      strL = `${hex(state.lStick.x)} ${hex(state.lStick.y)}`;
    }
    if (state.rStick.isDirty) {
      flag |= 0x1;
      strR = `${hex(state.rStick.x)} ${hex(state.rStick.y)}`;
    }
    return `0x${hex(flag).padStart(4, "0")} ${state.hat.value} ${strL} ${strR}`;
  }
}
