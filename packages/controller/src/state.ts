import { Button } from "./button.ts";
import { Hat } from "./hat.ts";
import { type StickTilt, StickTiltRange } from "./stick-tilt.ts";

/**
 * Represents the state of a button.
 */
class ButtonState {
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
    this.hold(buttons);
  }

  /**
   * The value of the button state.
   */
  get value() {
    return this._value;
  }

  /**
   * Changes the state of the specified buttons to hold.
   *
   * @param buttons
   */
  hold(buttons: Button[]) {
    this._value = buttons.reduce(
      (prev, current) => prev | current,
      this._value,
    );
  }

  /**
   * Changes the state of the specified buttons to release.
   *
   * @param buttons
   */
  release(buttons: Button[]) {
    this._value = buttons.reduce(
      (prev, current) => prev & ~current,
      this._value,
    );
  }

  /**
   * Changes the state of all buttons to release.
   */
  releaseAll() {
    this._value = 0;
  }
}

/**
 * Represents the state of a hat.
 */
class HatState {
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

  /**
   * The value of the hat state.
   */
  get value() {
    return this._value;
  }

  /**
   * Changes the state of the hat to hold.
   * @param hat
   */
  hold(hat: Hat) {
    this._value = hat;
  }

  /**
   * Changes the state of the hat to release.
   */
  release() {
    this._value = Hat.Neutral;
  }
}

/**
 * Represents the state of a stick.
 */
class StickState {
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

  /**
   * The x-coordinate of the stick state.
   */
  get x() {
    return this._x;
  }

  /**
   * The y-coordinate of the stick state.
   */
  get y() {
    return this._y;
  }

  /**
   * Changes the tilt of the stick state.
   *
   * @param newTilt
   */
  set tilt(newTilt: StickTilt) {
    this.x = newTilt.x;
    this.y = newTilt.y;
  }

  /**
   * `true` if the stick state is dirty; otherwise, false.
   */
  get isDirty() {
    return this._isDirty;
  }

  /**
   * Changes the tilt of the stick state to neutral.(x: ```StickTiltRange.Center```, y: ```StickTiltRange.Center```)
   * And sets the stick state to dirty if the stick state is changed.
   */
  toNeutral() {
    this.x = StickTiltRange.Center;
    this.y = StickTiltRange.Center;
  }

  /**
   * Sets the stick state to clean.
   * Use this method after consuming the stick state.
   */
  consume() {
    this._isDirty = false;
  }

  /**
   * Changes the x-coordinate of the stick state.
   * And sets the stick state to dirty if the stick state is changed.
   *
   * @param newValue
   * @private
   */
  private set x(newValue: number) {
    if (this._x !== newValue) {
      this._x = newValue;
      this._isDirty = true;
    }
  }

  /**
   * Changes the y-coordinate of the stick state.
   * And sets the stick state to dirty if the stick state is changed.
   *
   * @param newValue
   * @private
   */
  private set y(newValue: number) {
    if (this._y !== newValue) {
      this._y = newValue;
      this._isDirty = true;
    }
  }
}

/**
 * Represents the state of a controller.
 */
export class ControllerState {
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
    readonly buttons = new ButtonState(),
    readonly hat = new HatState(),
    readonly lStick = new StickState(),
    readonly rStick = new StickState(),
  ) {}

  /**
   * `true` if the controller stick state is dirty; otherwise, false.
   */
  get isDirty() {
    return this.lStick.isDirty || this.rStick.isDirty;
  }

  /**
   * Changes the state to release all buttons, hat, and sticks.
   */
  resetAll() {
    this.buttons.releaseAll();
    this.hat.release();
    this.lStick.toNeutral();
    this.rStick.toNeutral();
  }

  /**
   * Changes the state to clean the stick state.
   * Use this method after consuming the stick state.
   */
  consumeSticks() {
    this.lStick.consume();
    this.rStick.consume();
  }

  /**
   * Serializes the controller state to a string.
   */
  serialize() {
    return this.serializer.serialize(this);
  }
}

/**
 * Represents a state serializer.
 * The state serializer serializes the controller state to a string.
 */
export interface StateSerializer {
  serialize(state: ControllerState): string;
}

/**
 * Represents a state serializer that serializes the controller state to a string.
 */
export class StateSerializerImpl implements StateSerializer {
  /**
   * Serializes the controller state to a string.
   *
   * @param state
   */
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
