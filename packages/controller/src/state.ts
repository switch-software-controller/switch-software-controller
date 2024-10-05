import type { Button } from "./button.ts";
import { Hat } from "./hat.ts";
import { type StickTilt, StickTiltRange } from "./stick-tilt.ts";

class ButtonState {
  private _value = 0;

  constructor(buttons: Button[] = []) {
    this.hold(buttons);
  }

  get value() {
    return this._value;
  }

  hold(buttons: Button[]) {
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

  releaseAll() {
    this._value = 0;
  }
}

class HatState {
  private _value: Hat;

  constructor(hat: Hat = Hat.Center) {
    this._value = hat;
  }

  get value() {
    return this._value;
  }

  hold(hat: Hat) {
    this._value = hat;
  }

  release() {
    this._value = Hat.Center;
  }
}

class StickState {
  private _isDirty = false;
  private _x: number = StickTiltRange.Center;
  private _y: number = StickTiltRange.Center;

  constructor(initialTilt?: StickTilt) {
    if (initialTilt !== undefined) {
      this.x = initialTilt.x;
      this.y = initialTilt.y;
    }
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  set tilt(newTilt: StickTilt) {
    this.x = newTilt.x;
    this.y = newTilt.y;
  }

  get isDirty() {
    return this._isDirty;
  }

  toNeutral() {
    this.x = StickTiltRange.Center;
    this.y = StickTiltRange.Center;
  }

  consume() {
    this._isDirty = false;
  }

  private set x(newValue: number) {
    if (this._x !== newValue) {
      this._x = newValue;
      this._isDirty = true;
    }
  }

  private set y(newValue: number) {
    if (this._y !== newValue) {
      this._y = newValue;
      this._isDirty = true;
    }
  }
}

export class ControllerState {
  constructor(
    readonly buttons = new ButtonState(),
    readonly hat = new HatState(),
    readonly lStick = new StickState(),
    readonly rStick = new StickState(),
  ) {}

  get isDirty() {
    return this.lStick.isDirty || this.rStick.isDirty;
  }

  resetAll() {
    this.buttons.releaseAll();
    this.hat.release();
    this.lStick.toNeutral();
    this.rStick.toNeutral();
  }

  consumeSticks() {
    this.lStick.consume();
    this.rStick.consume();
  }

  serialize() {
    const hex = (n: number) => {
      return Number(n).toString(16);
    };

    let strL = "";
    let strR = "";

    let flag = this.buttons.value << 2;
    if (this.lStick.isDirty) {
      flag |= 0x2;
      strL = `${hex(this.lStick.x)} ${hex(this.lStick.y)}`;
    }
    if (this.rStick.isDirty) {
      flag |= 0x1;
      strR = `${hex(this.rStick.x)} ${hex(this.rStick.y)}`;
    }
    return `0x${hex(flag).padStart(4, "0")} ${this.hat.value} ${strL} ${strR}`;
  }
}
