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
