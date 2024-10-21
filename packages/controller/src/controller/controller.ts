import type {
  Controller,
  ControllerState,
  StateChanger,
} from "@switch-software-controller/controller-api";
import type { SerializedStateSender } from "./serialized-state-sender.ts";

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
