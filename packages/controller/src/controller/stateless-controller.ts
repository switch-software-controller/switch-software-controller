import type { StatelessController, } from "@switch-software-controller/controller-api";
import type { SerializedStateSender } from "./serialized-state-sender.ts";

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
