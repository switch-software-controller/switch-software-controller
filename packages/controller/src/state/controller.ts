import type {
  ButtonState,
  ControllerState,
  HatState,
  StickState,
} from '@switch-software-controller/controller-api';

export class ControllerStateImpl implements ControllerState {
  /**
   * Creates a new controller state with the specified buttons, hat, left stick, and right stick.
   *
   * @param buttons The State of the buttons.
   * @param hat The State of the hat.
   * @param lStick The State of the left stick.
   * @param rStick The State of the right stick.
   */
  constructor(
    readonly buttons: ButtonState,
    readonly hat: HatState,
    readonly lStick: StickState,
    readonly rStick: StickState,
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
}
