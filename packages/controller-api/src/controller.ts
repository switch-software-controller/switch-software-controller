import type { ControllerState } from "./state.ts";

/**
 * A function that change the controller state.
 */
export type StateChanger = (state: ControllerState) => void;

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
