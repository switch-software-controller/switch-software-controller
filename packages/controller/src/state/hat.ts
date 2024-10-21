import { Hat, type HatState, } from "@switch-software-controller/controller-api";
import { HatValue } from "../primitives";

/**
 * Default Implementation of HatState
 */
export class HatStateImpl implements HatState {
  /**
   * The value of the hat state.
   * @private
   */
  private _value: HatValue;

  /**
   * Creates a new hat state with the specified hat.
   * @param hat
   */
  constructor(hat: Hat = Hat.Neutral) {
    this._value = HatValue[hat];
  }

  get value() {
    return this._value;
  }

  press(hat: Hat) {
    this._value = HatValue[hat];
  }

  reset() {
    this._value = HatValue[Hat.Neutral];
  }
}
