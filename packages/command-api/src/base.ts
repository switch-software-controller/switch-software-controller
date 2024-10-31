import {
  Button,
  type Controller,
  Hat,
  type StateChanger,
  type StickTilt,
  StickTiltPreset,
} from '@switch-software-controller/controller-api';
import type { Logger } from '@switch-software-controller/logger-api';
import type { ElapsedTime, Timer } from '@switch-software-controller/timer-api';
import type { CommandPath } from './path.ts';

/**
 * An error that is thrown when the command is cancelled.
 */
export class CommandCancelledError extends Error {
  constructor() {
    super('The command has been cancelled.');
  }
}

/**
 * A decorator that checks whether the command has been cancelled.
 */
export function checkCancelled(): MethodDecorator {
  return (_target, _propertyKey, descriptor) => {
    // biome-ignore lint/suspicious/noExplicitAny:
    const originalMethod = descriptor.value as (...args: any[]) => any;
    // biome-ignore lint/suspicious/noExplicitAny:
    (descriptor as any).value = function (...args: any[]) {
      const ret = originalMethod.apply(this, args);
      // biome-ignore lint/suspicious/noExplicitAny:
      const isCancelled: boolean = (this as any).isCancelled ?? false;
      if (isCancelled) {
        throw new CommandCancelledError();
      }
      return ret;
    };
  };
}

/**
 * Waiter interface.
 */
export interface Waiter {
  /**
   * Wait for a specified duration.
   * @param duration
   */
  wait(duration: number): Promise<void>;
}

/**
 * A base class for a command.
 */
export abstract class BaseCommand {
  /**
   * The name of the command.
   */
  readonly name: string;

  /**
   * The path for the command.
   */
  readonly path: CommandPath;

  /**
   * The controller for the command.
   */
  readonly controller: Controller;

  /**
   * The timer for the command.
   */
  readonly timer: Timer;

  /**
   * The logger for the command.
   */
  readonly logger: Logger;

  /**
   * A function that waits for a specified duration.
   */
  private readonly waiter: Waiter;

  /**
   * The default duration for controller sends.
   * @private
   */
  private _defaultDuration = 100;

  /**
   * The default interval between controller sends.
   * @private
   */
  private _defaultInterval = 100;

  private _isCancelled = false;

  private _attemptCount = 0;

  constructor(
    name: string,
    path: CommandPath,
    controller: Controller,
    timer: Timer,
    logger: Logger,
    waiter: Waiter,
  ) {
    this.name = name;
    this.path = path;
    this.controller = controller;
    this.timer = timer;
    this.logger = logger;
    this.waiter = waiter;
  }

  /**
   * A flag indicating whether the command is cancelled.
   */
  get isCancelled(): boolean {
    return this._isCancelled;
  }

  /**
   * The number of attempts.
   * It is expected that the number of times the main loop has been executed within
   * the `process()` is being counted since this command started running.
   * This value should be incremented by the `attempt()` method.
   */
  get attemptCount(): number {
    return this._attemptCount;
  }

  /**
   * The elapsed time since the command started.
   */
  get elapsedTime(): ElapsedTime {
    return this.timer.elapsedTime;
  }

  /**
   * The default duration for controller sends.
   */
  get defaultDuration(): number {
    return this._defaultDuration;
  }

  /**
   * Set the default duration for controller sends.
   */
  set defaultDuration(duration: number) {
    if (duration !== null && duration !== undefined && duration > 0) {
      this._defaultDuration = duration;
    }
  }

  /**
   * The default interval between controller sends.
   */
  get defaultInterval(): number {
    return this._defaultInterval;
  }

  /**
   * Set the default interval between controller sends.
   */
  set defaultInterval(interval: number) {
    if (interval !== null && interval !== undefined && interval > 0) {
      this._defaultInterval = interval;
    }
  }

  async execute() {
    try {
      this.preprocess();
      await this.process();
    } catch (error) {
      if (!(error instanceof CommandCancelledError)) {
        throw error;
      }
      this.logger.error(error.message);
    } finally {
      this.postprocess();
    }
  }

  /**
   * Stop the command.
   */
  cancel() {
    this._isCancelled = true;
  }

  /**
   * The main process that should be implemented independently.
   */
  abstract process(): Promise<void>;

  /**
   * Preprocess the command.
   */
  preprocess() {
    this.timer.start();
    this._isCancelled = false;
    this._attemptCount = 0;
  }

  /**
   * Postprocess the command.
   */
  postprocess() {
    this.timer.stop();
  }

  /**
   * Increase the attempt count.
   */
  @checkCancelled()
  attempt(): void {
    this._attemptCount++;
  }

  /**
   * Wait for a specified duration.
   * @param duration duration to wait
   * @param checkInterval interval to check the cancellation
   */
  @checkCancelled()
  async wait(duration: number, checkInterval = 1000): Promise<void> {
    if (duration <= 0) {
      return;
    }

    // 1000 <= interval <= 10000
    const interval = Math.min(10000, Math.max(checkInterval, 1000));

    if (duration <= interval) {
      await this.waiter.wait(duration);
      return;
    }

    for (let i = 0; i < duration / interval; i++) {
      await this.waiter.wait(interval);
      if (this.isCancelled) {
        throw new CommandCancelledError();
      }
    }
    await this.waiter.wait(duration % interval);
  }

  /**
   * Press the buttons for a specified duration.
   * @param buttons buttons to press
   * @param duration duration to press the buttons
   */
  @checkCancelled()
  async pressButtons(
    buttons: Button[],
    duration: number = this.defaultDuration,
  ): Promise<void> {
    this.controller.send((state) => {
      state.buttons.press(buttons);
    });
    await this.wait(duration ?? this.defaultDuration);
    this.controller.send((state) => {
      state.buttons.reset();
    });
  }

  /**
   * Press the hat for a specified duration.
   * @param hat hat to press
   * @param duration duration to press the hat
   */
  @checkCancelled()
  async pressHat(
    hat: Hat,
    duration: number = this.defaultDuration,
  ): Promise<void> {
    this.controller.send((state) => {
      state.hat.press(hat);
    });
    await this.wait(duration ?? this.defaultDuration);
    this.controller.send((state) => {
      state.hat.reset();
    });
  }

  /**
   * Tilt LStick for a specified duration.
   * @param tilt tilt to set
   * @param duration duration to set the tilt
   */
  @checkCancelled()
  async tiltLStick(
    tilt: StickTilt,
    duration: number = this.defaultDuration,
  ): Promise<void> {
    this.controller.send((state) => {
      state.lStick.tilt = tilt;
    });
    await this.wait(duration ?? this.defaultDuration);
    this.controller.send((state) => {
      state.lStick.tiltPreset = StickTiltPreset.Neutral;
    });
  }

  /**
   * Tilt RStick for a specified duration.
   * @param tilt tilt to set
   * @param duration duration to set the tilt
   */
  @checkCancelled()
  async tiltRStick(tilt: StickTilt, duration?: number): Promise<void> {
    this.controller.send((state) => {
      state.rStick.tilt = tilt;
    });
    await this.wait(duration ?? this.defaultDuration);
    this.controller.send((state) => {
      state.rStick.tiltPreset = StickTiltPreset.Neutral;
    });
  }

  /**
   * Tilt LStick by a preset for a specified duration.
   * @param preset
   * @param duration
   */
  @checkCancelled()
  async tiltLStickByPreset(
    preset: StickTiltPreset,
    duration?: number,
  ): Promise<void> {
    this.controller.send((state) => {
      state.lStick.tiltPreset = preset;
    });
    await this.wait(duration ?? this.defaultDuration);
    this.controller.send((state) => {
      state.lStick.tiltPreset = StickTiltPreset.Neutral;
    });
  }

  /**
   * Tilt RStick by a preset for a specified duration.
   * @param preset
   * @param duration
   */
  @checkCancelled()
  async tiltRStickByPreset(
    preset: StickTiltPreset,
    duration?: number,
  ): Promise<void> {
    this.controller.send((state) => {
      state.rStick.tiltPreset = preset;
    });
    await this.wait(duration ?? this.defaultDuration);
    this.controller.send((state) => {
      state.rStick.tiltPreset = StickTiltPreset.Neutral;
    });
  }

  /**
   * Press A button for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async pressA(duration?: number): Promise<void> {
    return this.pressButtons([Button.A], duration);
  }

  /**
   * Press B button for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async pressB(duration?: number): Promise<void> {
    return this.pressButtons([Button.B], duration);
  }

  /**
   * Press X button for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async pressX(duration?: number): Promise<void> {
    return this.pressButtons([Button.X], duration);
  }

  /**
   * Press Y button for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async pressY(duration?: number): Promise<void> {
    return this.pressButtons([Button.Y], duration);
  }

  /**
   * Press L button for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async pressL(duration?: number): Promise<void> {
    return this.pressButtons([Button.L], duration);
  }

  /**
   * Press R button for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async pressR(duration?: number): Promise<void> {
    return this.pressButtons([Button.R], duration);
  }

  /**
   * Press ZL button for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async pressZL(duration?: number): Promise<void> {
    return this.pressButtons([Button.ZL], duration);
  }

  /**
   * Press ZR button for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async pressZR(duration?: number): Promise<void> {
    return this.pressButtons([Button.ZR], duration);
  }

  /**
   * Press LStick for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async pressLStick(duration?: number): Promise<void> {
    return this.pressButtons([Button.LStick], duration);
  }

  /**
   * Press RStick for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async pressRStick(duration?: number): Promise<void> {
    return this.pressButtons([Button.RStick], duration);
  }

  /**
   * Press Plus button for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async pressPlus(duration?: number): Promise<void> {
    return this.pressButtons([Button.Plus], duration);
  }

  /**
   * Press Minus button for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async pressMinus(duration?: number): Promise<void> {
    return this.pressButtons([Button.Minus], duration);
  }

  /**
   * Press Home button for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async pressHome(duration?: number): Promise<void> {
    return this.pressButtons([Button.Home], duration);
  }

  /**
   * Press Capture button for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async pressCapture(duration?: number): Promise<void> {
    return this.pressButtons([Button.Capture], duration);
  }

  /**
   * Press Hat Top for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async pressHatTop(duration?: number): Promise<void> {
    return this.pressHat(Hat.Top, duration);
  }

  /**
   * Press Hat Top Right for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async pressHatTopRight(duration?: number): Promise<void> {
    return this.pressHat(Hat.TopRight, duration);
  }

  /**
   * Press Hat Right for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async pressHatRight(duration?: number): Promise<void> {
    return this.pressHat(Hat.Right, duration);
  }

  /**
   * Press Hat Bottom Right for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async pressHatBottomRight(duration?: number): Promise<void> {
    return this.pressHat(Hat.BottomRight, duration);
  }

  /**
   * Press Hat Bottom for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async pressHatBottom(duration?: number): Promise<void> {
    return this.pressHat(Hat.Bottom, duration);
  }

  /**
   * Press Hat Bottom Left for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async pressHatBottomLeft(duration?: number): Promise<void> {
    return this.pressHat(Hat.BottomLeft, duration);
  }

  /**
   * Press Hat Left for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async pressHatLeft(duration?: number): Promise<void> {
    return this.pressHat(Hat.Left, duration);
  }

  /**
   * Press Hat Top Left for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async pressHatTopLeft(duration?: number): Promise<void> {
    return this.pressHat(Hat.TopLeft, duration);
  }

  /**
   * Press Hat Neutral for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async pressHatNeutral(duration?: number): Promise<void> {
    return this.pressHat(Hat.Neutral, duration);
  }

  /**
   * Tilt LStick to Top for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async tiltLStickTop(duration?: number): Promise<void> {
    return this.tiltLStickByPreset(StickTiltPreset.Top, duration);
  }

  /**
   * Tilt LStick to Top Right for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async tiltLStickTopRight(duration?: number): Promise<void> {
    return this.tiltLStickByPreset(StickTiltPreset.TopRight, duration);
  }

  /**
   * Tilt LStick to Right for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async tiltLStickRight(duration?: number): Promise<void> {
    return this.tiltLStickByPreset(StickTiltPreset.Right, duration);
  }

  /**
   * Tilt LStick to Bottom Right for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async tiltLStickBottomRight(duration?: number): Promise<void> {
    return this.tiltLStickByPreset(StickTiltPreset.BottomRight, duration);
  }

  /**
   * Tilt LStick to Bottom for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async tiltLStickBottom(duration?: number): Promise<void> {
    return this.tiltLStickByPreset(StickTiltPreset.Bottom, duration);
  }

  /**
   * Tilt LStick to Bottom Left for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async tiltLStickBottomLeft(duration?: number): Promise<void> {
    return this.tiltLStickByPreset(StickTiltPreset.BottomLeft, duration);
  }

  /**
   * Tilt LStick to Left for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async tiltLStickLeft(duration?: number): Promise<void> {
    return this.tiltLStickByPreset(StickTiltPreset.Left, duration);
  }

  /**
   * Tilt LStick to Top Left for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async tiltLStickTopLeft(duration?: number): Promise<void> {
    return this.tiltLStickByPreset(StickTiltPreset.TopLeft, duration);
  }

  /**
   * Tilt LStick to Neutral for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async tiltLStickNeutral(duration?: number): Promise<void> {
    return this.tiltLStickByPreset(StickTiltPreset.Neutral, duration);
  }

  /**
   * Tilt RStick to Top for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async tiltRStickTop(duration?: number): Promise<void> {
    return this.tiltRStickByPreset(StickTiltPreset.Top, duration);
  }

  /**
   * Tilt RStick to Top Right for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async tiltRStickTopRight(duration?: number): Promise<void> {
    return this.tiltRStickByPreset(StickTiltPreset.TopRight, duration);
  }

  /**
   * Tilt RStick to Right for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async tiltRStickRight(duration?: number): Promise<void> {
    return this.tiltRStickByPreset(StickTiltPreset.Right, duration);
  }

  /**
   * Tilt RStick to Bottom Right for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async tiltRStickBottomRight(duration?: number): Promise<void> {
    return this.tiltRStickByPreset(StickTiltPreset.BottomRight, duration);
  }

  /**
   * Tilt RStick to Bottom for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async tiltRStickBottom(duration?: number): Promise<void> {
    return this.tiltRStickByPreset(StickTiltPreset.Bottom, duration);
  }

  /**
   * Tilt RStick to Bottom Left for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async tiltRStickBottomLeft(duration?: number): Promise<void> {
    return this.tiltRStickByPreset(StickTiltPreset.BottomLeft, duration);
  }

  /**
   * Tilt RStick to Left for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async tiltRStickLeft(duration?: number): Promise<void> {
    return this.tiltRStickByPreset(StickTiltPreset.Left, duration);
  }

  /**
   * Tilt RStick to Top Left for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async tiltRStickTopLeft(duration?: number): Promise<void> {
    return this.tiltRStickByPreset(StickTiltPreset.TopLeft, duration);
  }

  /**
   * Tilt RStick to Neutral for a specified duration.
   * @param duration
   */
  @checkCancelled()
  async tiltRStickNeutral(duration?: number): Promise<void> {
    return this.tiltRStickByPreset(StickTiltPreset.Neutral, duration);
  }

  /**
   * Repeat the state change for a specified number of times.
   * @param stateChanger
   * @param times number of times to repeat
   * @param duration duration to keep the state
   * @param interval interval between state changes
   */
  @checkCancelled()
  async changeRepeat(
    stateChanger: StateChanger,
    times: number,
    duration?: number,
    interval?: number,
  ): Promise<void> {
    for (let i = 0; i < times; i++) {
      this.controller.send(stateChanger);
      await this.wait(duration ?? this.defaultDuration);
      this.reset();
      await this.wait(interval ?? this.defaultInterval);
    }
  }

  @checkCancelled()
  reset() {
    this.controller.send((state) => {
      state.reset();
    });
  }

  /**
   * A function executed to have the Nintendo Switch recognize the controller.
   * The controller is recognized by pressing buttons multiple times.
   * @param buttons
   * @param duration
   * @param interval
   */
  @checkCancelled()
  async getRecognition(
    buttons: Button[] = [Button.ZL],
    duration?: number,
    interval?: number,
  ): Promise<void> {
    await this.changeRepeat(
      (state) => {
        state.buttons.press(buttons);
      },
      3,
      duration,
      interval,
    );
  }
}
