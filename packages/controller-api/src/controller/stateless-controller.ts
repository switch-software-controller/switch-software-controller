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
