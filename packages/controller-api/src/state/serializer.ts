import type { ControllerState } from "./controller.ts";

/**
 * Represents a state serializer.
 * The state serializer serializes the controller state to a string.
 */
export interface StateSerializer {
  /**
   * Serializes the controller state to a string.
   * @param state
   */
  serialize(state: ControllerState): string;
}
