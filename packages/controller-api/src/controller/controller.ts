import type { ControllerState } from "../state";
import type { StateChanger } from "./state-changer.ts";

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
  send(stateChanger?: StateChanger): void;
}
