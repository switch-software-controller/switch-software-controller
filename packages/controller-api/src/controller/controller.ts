import type { StateChanger } from "./state-changer.ts";

/**
 * The controller that can send input to the device.
 */
export interface Controller {
  /**
   * Sends the state to the device.
   * You can specify a function that changes the state before sending it.
   *
   * @param stateChanger A function that changes the controller state. called before sending the state.
   */
  send(stateChanger?: StateChanger): void;
}
