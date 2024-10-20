import type { StateChanger, ControllerState, Controller, StatelessController } from "@switch-software-controller/controller-api";

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
   */
  constructor(
    readonly state: ControllerState,
    private readonly sender: SerializedStateSender,
  ) {}

  get isOpen(): boolean {
    return this.sender.isOpen;
  }

  close(): void {
    this.sender.close();
  }

  send(stateChanger?: StateChanger): void {
    stateChanger?.(this.state);
    this.sender.send(this.state.serialize());
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
