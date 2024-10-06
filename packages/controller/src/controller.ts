import type { ControllerState } from "./state.ts";

const defaultPressDuration = 100; // ms
const defaultRepeatInterval = 100; // ms

/**
 * A function that change the controller state.
 */
export type StateChanger = (state: ControllerState) => void;

/**
 * Options for the `sendRepeat` method of `Controller`.
 */
export type SendRepeatOptions = {
  /**
   * The number of times to send the state.
   */
  times?: number;

  /**
   * The duration to hold the state.
   */
  duration?: number;

  /**
   * The interval between sending the state.
   */
  interval?: number;

  /**
   * `true` to skip the last interval; otherwise, `false`.
   */
  skipLastInterval?: boolean;
};

/**
 * The controller that can send input to the device.
 */
export interface Controller {
  /**
   * `true` if the controller is open; otherwise, `false`.
   */
  get isOpen(): boolean;

  /**
   * The current state of the controller.
   */
  get state(): ControllerState;

  /**
   * Closes the controller.
   */
  close(): void;

  /**
   * Sends the state to the device.
   * You can specify a function that changes the state before sending it.
   *
   * @param stateChanger A function that changes the controller state. called before sending the state.
   */
  sendHold(stateChanger?: StateChanger): void;

  /**
   * Changes the state to release all buttons, hat, and sticks, and then sends the state to the device.
   */
  sendReset(): void;

  /**
   * Sends the state to the device, and then resets the state.
   *
   * @param stateChanger A function that changes the controller state. called before sending the state.
   * @param duration The duration to hold the state before resetting it.
   */
  sendWithReset(stateChanger: StateChanger, duration?: number): Promise<void>;

  /**
   * Sends the state to the device repeatedly.
   *
   * @param stateChanger A function that changes the controller state. called before sending the state.
   * @param options Options for sending the state repeatedly.
   */
  sendRepeat(
    stateChanger: StateChanger,
    options?: SendRepeatOptions,
  ): Promise<void>;

  /**
   * Sends the serial state changes to the device.
   *
   * example:
   *
   * ```ts
   * const withReset = false;
   * await controller.sendSeries([
   *   [state => state.buttons.hold([Button.A]), 100], // hold [A] for 100ms
   *   [state => state.buttons.hold([Button.B]), 100], // hold [A, B] for 100ms
   *   [state => state.buttons.hold([Button.X]), 100], // hold [A, B, X] for 100ms
   *   [state => state.buttons.hold([Button.Y]), 100], // hold [A, B, X, Y] for 100ms
   * ], withReset); // reset the state after sending each state changes
   * ```
   *
   * @param changes The serial state changes to send. Each item is a tuple of a state changer and a duration.
   * @param withReset `true` to reset the state after sending each state changes; otherwise, `false`.
   */
  sendSeries(
    changes: [StateChanger, number][],
    withReset?: boolean,
  ): Promise<void>;
}

/**
 * The controller that can send input to the device.
 * This controller does not have a `ControllerState`.
 * You can only send the string that serialized state to the device.
 */
export interface StatelessController {
  /**
   * `true` if the controller is open; otherwise, `false`.
   */
  get isOpen(): boolean;

  /**
   * Closes the controller.
   */
  close(): void;

  /**
   * Sends the serialized state to the device.
   *
   * @param serializedState The serialized state to send.
   */
  send(serializedState: string): void;
}

/**
 * The controller that can send the serialized state to the device.
 */
export interface SerializedStateSender {
  /**
   * `true` if the controller is open; otherwise, `false`.
   */
  get isOpen(): boolean;

  /**
   * Closes the controller.
   */
  close(): void;

  /**
   * Sends the serialized state to the device.
   *
   * @param serializedState
   */
  send(serializedState: string): void;
}

/**
 * The default implementation of the `Controller`.
 */
export class ControllerImpl implements Controller {
  /**
   * Initializes a new instance of the `ControllerImpl` class.
   *
   * @param state The initial state of the controller.
   * @param sender The sender that sends the serialized state to the device.
   * @param wait The function that waits for the specified duration.
   */
  constructor(
    readonly state: ControllerState,
    private readonly sender: SerializedStateSender,
    private readonly wait: (duration: number) => Promise<void>,
  ) {}

  get isOpen(): boolean {
    return this.sender.isOpen;
  }

  close(): void {
    this.sender.close();
  }

  sendHold(stateChanger?: StateChanger): void {
    stateChanger?.(this.state);
    this.sender.send(this.state.serialize());
  }

  sendReset() {
    this.sendHold(() => this.state.resetAll());
  }

  async sendWithReset(
    stateChanger: StateChanger,
    duration: number = defaultPressDuration,
  ): Promise<void> {
    this.sendHold(stateChanger);
    await this.wait(duration);
    this.sendReset();
  }

  async sendRepeat(
    stateChanger: StateChanger,
    options?: SendRepeatOptions,
  ): Promise<void> {
    const {
      times = 1,
      duration = defaultPressDuration,
      interval = defaultRepeatInterval,
      skipLastInterval = false,
    } = options ?? {};

    if (times < 1) {
      return;
    }

    for (let i = 0; i < times; i++) {
      await this.sendWithReset(stateChanger, duration);
      if (skipLastInterval && i + 1 >= times) {
        break;
      }
      await this.wait(interval);
    }
  }

  async sendSeries(
    changes: [StateChanger, number][],
    withReset = true,
  ): Promise<void> {
    for (const [stateChanger, duration] of changes) {
      this.sendHold(stateChanger);
      await this.wait(duration);
      if (withReset) {
        this.sendReset();
      }
    }
  }
}

/**
 * The default implementation of the `StatelessController`.
 */
export class StatelessControllerImpl implements StatelessController {
  /**
   * Initializes a new instance of the `StatelessControllerImpl` class.
   *
   * @param sender The sender that sends the serialized state to the device.
   */
  constructor(private readonly sender: SerializedStateSender) {}

  get isOpen(): boolean {
    return this.sender.isOpen;
  }

  close(): void {
    this.sender.close();
  }

  send(serializedState: string): void {
    this.sender.send(serializedState);
  }
}
