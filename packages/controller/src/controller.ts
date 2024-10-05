import type { ControllerState } from "./state.ts";

export type StateChanger = (state: ControllerState) => void;

export type SendRepeatOptions = {
  times?: number;
  duration?: number;
  interval?: number;
  skipLastInterval?: boolean;
};

export interface Controller {
  get isOpen(): boolean;

  get state(): ControllerState;

  close(): void;

  sendHold(stateChange?: StateChanger): void;

  sendWithReset(stateChange: StateChanger, duration?: number): Promise<void>;

  sendRepeat(
    stateChanger: StateChanger,
    options?: SendRepeatOptions,
  ): Promise<void>;

  sendSeries(
    changes: [StateChanger, number][],
    withReset?: boolean,
  ): Promise<void>;
}

export interface StatelessController {
  get isOpen(): boolean;

  close(): void;

  send(serializedState: string): void;
}
