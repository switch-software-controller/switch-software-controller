import type { ControllerState } from '../state';

/**
 * A function that change the controller state.
 */
export type StateChanger = (state: ControllerState) => void;
