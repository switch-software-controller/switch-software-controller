import type {
  Controller,
  ControllerState,
  StateChanger,
} from '@switch-software-controller/controller-api';
import type { SerialPort } from '@switch-software-controller/serial-port-api';

/**
 * The default implementation of the `Controller`.
 */
export class ControllerImpl implements Controller {
  /**
   * Initializes a new instance of the `ControllerImpl` class.
   *
   * @param state The initial state of the controller.
   * @param port The serial port to send the state.
   */
  constructor(
    private readonly state: ControllerState,
    private readonly port: SerialPort,
  ) {}

  async send(stateChanger?: StateChanger): Promise<void> {
    stateChanger?.(this.state);
    const serialized = this.serialize(this.state);
    this.state.consumeSticks();
    console.log(`[Debug] sending: ${serialized}`);
    await this.port.writeLine(serialized);
    console.log(`[Debug] sent: ${serialized}`);
  }

  /**
   * Serializes the controller state to a string.
   * @param state
   * @private
   */
  private serialize(state: ControllerState): string {
    const hex = (n: number) => {
      return Number(n).toString(16);
    };

    let strL = '';
    let strR = '';

    let flag = state.buttons.value << 2;
    if (state.lStick.isDirty) {
      flag |= 0x2;
      strL = `${hex(state.lStick.x)} ${hex(state.lStick.y)}`;
    }
    if (state.rStick.isDirty) {
      flag |= 0x1;
      strR = `${hex(state.rStick.x)} ${hex(state.rStick.y)}`;
    }
    return `0x${hex(flag).padStart(4, '0')} ${state.hat.value} ${strL} ${strR}`;
  }
}
