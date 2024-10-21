import { Button, type ButtonState } from '@switch-software-controller/controller-api';
import { ButtonValue } from '../primitives';

/**
 * Default Implementation of ButtonState
 */
export class ButtonStateImpl implements ButtonState {
  /**
   * The value of the button state.
   * @private
   */
  private _value: number = ButtonValue[Button.Noop];

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
      (prev, current) => prev | ButtonValue[current],
      this._value,
    );
  }

  release(buttons: Button[]) {
    this._value = buttons.reduce(
      (prev, current) => prev & ~ButtonValue[current],
      this._value,
    );
  }

  reset() {
    this._value = ButtonValue[Button.Noop];
  }
}

