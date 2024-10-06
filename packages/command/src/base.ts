import {
  Button,
  type Controller,
  Hat,
  type StatelessController,
  type StickTilt,
  StickTiltPreset,
} from "@switch-software-controller/controller";
import type { Logger } from "@switch-software-controller/logger";
import type { ElapsedTime, Timer } from "@switch-software-controller/timer";
import type { CommandPath } from "./path.ts";

/**
 * An error that is thrown when the command is cancelled.
 */
export class CommandCancelledError extends Error {
  constructor() {
    super("The command has been cancelled.");
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
 * A function that waits for a specified duration.
 */
export type Waiter = (duration: number) => Promise<void>;

/**
 * A base class for a command.
 */
export abstract class BaseCommand {
  private _isCancelled = false;

  private _attemptCount = 0;

  /**
   * The default duration for button presses.
   * @private
   */
  private defaultDuration: number | undefined = undefined;

  constructor(
    /**
     * The name of the command.
     */
    readonly name: string,
    /**
     * The path for the command.
     */
    readonly path: CommandPath,
    /**
     * The controller for the command.
     */
    readonly controller: Controller,
    /**
     * The stateless controller for the command.
     */
    readonly statelessController: StatelessController,
    /**
     * The timer for the command.
     */
    readonly timer: Timer,
    /**
     * The logger for the command.
     */
    readonly logger: Logger,
    /**
     * A function that waits for a specified duration.
     */
    private readonly wait: Waiter,
  ) {}

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
  attempt() {
    this._attemptCount++;
  }

  /**
   * Shortcut for `this.controller.sendWithReset((state) => {state.buttons.hold(buttons)}, duration)`.;
   * @param buttons buttons to press
   * @param duration duration to press the buttons
   */
  async pressButtons(buttons: Button[], duration?: number): Promise<void> {
    return this.controller.sendWithReset((state) => {
      state.buttons.hold(buttons);
    }, duration ?? this.defaultDuration);
  }

  /**
   * Shortcut for `this.controller.sendWithReset((state) => {state.hat.hold(hat)}, duration)`.
   * @param hat hat to press
   * @param duration duration to press the hat
   */
  async pressHat(hat: Hat, duration?: number): Promise<void> {
    return this.controller.sendWithReset((state) => {
      state.hat.hold(hat);
    }, duration ?? this.defaultDuration);
  }

  /**
   * Shortcut for `this.controller.sendWithReset((state) => {state.lStick.tilt = tilt}, duration)`.
   * @param tilt tilt to set
   * @param duration duration to set the tilt
   */
  async tiltLStick(tilt: StickTilt, duration?: number): Promise<void> {
    return this.controller.sendWithReset((state) => {
      state.lStick.tilt = tilt;
    }, duration ?? this.defaultDuration);
  }

  /**
   * Shortcut for `this.controller.sendWithReset((state) => {state.rStick.tilt = tilt}, duration)`.
   * @param tilt tilt to set
   * @param duration duration to set the tilt
   */
  async tiltRStick(tilt: StickTilt, duration?: number): Promise<void> {
    return this.controller.sendWithReset((state) => {
      state.rStick.tilt = tilt;
    }, duration ?? this.defaultDuration);
  }

  /**
   * Hold the serialized state.
   * Shortcut for `this.statelessController.send(serializedState)`.
   * @param serializedState serialized state to hold
   */
  holdSerialized(serializedState: string): void {
    this.statelessController.send(serializedState);
  }

  /**
   * Press A button for a specified duration.
   * @param duration
   */
  async pressA(duration?: number): Promise<void> {
    return this.pressButtons([Button.A], duration);
  }

  /**
   * Press B button for a specified duration.
   * @param duration
   */
  async pressB(duration?: number): Promise<void> {
    return this.pressButtons([Button.B], duration);
  }

  /**
   * Press X button for a specified duration.
   * @param duration
   */
  async pressX(duration?: number): Promise<void> {
    return this.pressButtons([Button.X], duration);
  }

  /**
   * Press Y button for a specified duration.
   * @param duration
   */
  async pressY(duration?: number): Promise<void> {
    return this.pressButtons([Button.Y], duration);
  }

  /**
   * Press L button for a specified duration.
   * @param duration
   */
  async pressL(duration?: number): Promise<void> {
    return this.pressButtons([Button.L], duration);
  }

  /**
   * Press R button for a specified duration.
   * @param duration
   */
  async pressR(duration?: number): Promise<void> {
    return this.pressButtons([Button.R], duration);
  }

  /**
   * Press ZL button for a specified duration.
   * @param duration
   */
  async pressZL(duration?: number): Promise<void> {
    return this.pressButtons([Button.ZL], duration);
  }

  /**
   * Press ZR button for a specified duration.
   * @param duration
   */
  async pressZR(duration?: number): Promise<void> {
    return this.pressButtons([Button.ZR], duration);
  }

  /**
   * Press LStick for a specified duration.
   * @param duration
   */
  async pressLStick(duration?: number): Promise<void> {
    return this.pressButtons([Button.LStick], duration);
  }

  /**
   * Press RStick for a specified duration.
   * @param duration
   */
  async pressRStick(duration?: number): Promise<void> {
    return this.pressButtons([Button.RStick], duration);
  }

  /**
   * Press Plus button for a specified duration.
   * @param duration
   */
  async pressPlus(duration?: number): Promise<void> {
    return this.pressButtons([Button.Plus], duration);
  }

  /**
   * Press Minus button for a specified duration.
   * @param duration
   */
  async pressMinus(duration?: number): Promise<void> {
    return this.pressButtons([Button.Minus], duration);
  }

  /**
   * Press Home button for a specified duration.
   * @param duration
   */
  async pressHome(duration?: number): Promise<void> {
    return this.pressButtons([Button.Home], duration);
  }

  /**
   * Press Capture button for a specified duration.
   * @param duration
   */
  async pressCapture(duration?: number): Promise<void> {
    return this.pressButtons([Button.Capture], duration);
  }

  /**
   * Press Hat Top for a specified duration.
   * @param duration
   */
  async pressHatTop(duration?: number): Promise<void> {
    return this.pressHat(Hat.Top, duration);
  }

  /**
   * Press Hat Top Right for a specified duration.
   * @param duration
   */
  async pressHatTopRight(duration?: number): Promise<void> {
    return this.pressHat(Hat.TopRight, duration);
  }

  /**
   * Press Hat Right for a specified duration.
   * @param duration
   */
  async pressHatRight(duration?: number): Promise<void> {
    return this.pressHat(Hat.Right, duration);
  }

  /**
   * Press Hat Bottom Right for a specified duration.
   * @param duration
   */
  async pressHatBottomRight(duration?: number): Promise<void> {
    return this.pressHat(Hat.BottomRight, duration);
  }

  /**
   * Press Hat Bottom for a specified duration.
   * @param duration
   */
  async pressHatBottom(duration?: number): Promise<void> {
    return this.pressHat(Hat.Bottom, duration);
  }

  /**
   * Press Hat Bottom Left for a specified duration.
   * @param duration
   */
  async pressHatBottomLeft(duration?: number): Promise<void> {
    return this.pressHat(Hat.BottomLeft, duration);
  }

  /**
   * Press Hat Left for a specified duration.
   * @param duration
   */
  async pressHatLeft(duration?: number): Promise<void> {
    return this.pressHat(Hat.Left, duration);
  }

  /**
   * Press Hat Top Left for a specified duration.
   * @param duration
   */
  async pressHatTopLeft(duration?: number): Promise<void> {
    return this.pressHat(Hat.TopLeft, duration);
  }

  /**
   * Press Hat Neutral for a specified duration.
   * @param duration
   */
  async pressHatNeutral(duration?: number): Promise<void> {
    return this.pressHat(Hat.Neutral, duration);
  }

  /**
   * Tilt LStick to Top for a specified duration.
   * @param duration
   */
  async tiltLStickTop(duration?: number): Promise<void> {
    return this.tiltLStick(StickTiltPreset.Top, duration);
  }

  /**
   * Tilt LStick to Top Right for a specified duration.
   * @param duration
   */
  async tiltLStickTopRight(duration?: number): Promise<void> {
    return this.tiltLStick(StickTiltPreset.TopRight, duration);
  }

  /**
   * Tilt LStick to Right for a specified duration.
   * @param duration
   */
  async tiltLStickRight(duration?: number): Promise<void> {
    return this.tiltLStick(StickTiltPreset.Right, duration);
  }

  /**
   * Tilt LStick to Bottom Right for a specified duration.
   * @param duration
   */
  async tiltLStickBottomRight(duration?: number): Promise<void> {
    return this.tiltLStick(StickTiltPreset.BottomRight, duration);
  }

  /**
   * Tilt LStick to Bottom for a specified duration.
   * @param duration
   */
  async tiltLStickBottom(duration?: number): Promise<void> {
    return this.tiltLStick(StickTiltPreset.Bottom, duration);
  }

  /**
   * Tilt LStick to Bottom Left for a specified duration.
   * @param duration
   */
  async tiltLStickBottomLeft(duration?: number): Promise<void> {
    return this.tiltLStick(StickTiltPreset.BottomLeft, duration);
  }

  /**
   * Tilt LStick to Left for a specified duration.
   * @param duration
   */
  async tiltLStickLeft(duration?: number): Promise<void> {
    return this.tiltLStick(StickTiltPreset.Left, duration);
  }

  /**
   * Tilt LStick to Top Left for a specified duration.
   * @param duration
   */
  async tiltLStickTopLeft(duration?: number): Promise<void> {
    return this.tiltLStick(StickTiltPreset.TopLeft, duration);
  }

  /**
   * Tilt LStick to Neutral for a specified duration.
   * @param duration
   */
  async tiltLStickNeutral(duration?: number): Promise<void> {
    return this.tiltLStick(StickTiltPreset.Neutral, duration);
  }

  /**
   * Tilt RStick to Top for a specified duration.
   * @param duration
   */
  async tiltRStickTop(duration?: number): Promise<void> {
    return this.tiltRStick(StickTiltPreset.Top, duration);
  }

  /**
   * Tilt RStick to Top Right for a specified duration.
   * @param duration
   */
  async tiltRStickTopRight(duration?: number): Promise<void> {
    return this.tiltRStick(StickTiltPreset.TopRight, duration);
  }

  /**
   * Tilt RStick to Right for a specified duration.
   * @param duration
   */
  async tiltRStickRight(duration?: number): Promise<void> {
    return this.tiltRStick(StickTiltPreset.Right, duration);
  }

  /**
   * Tilt RStick to Bottom Right for a specified duration.
   * @param duration
   */
  async tiltRStickBottomRight(duration?: number): Promise<void> {
    return this.tiltRStick(StickTiltPreset.BottomRight, duration);
  }

  /**
   * Tilt RStick to Bottom for a specified duration.
   * @param duration
   */
  async tiltRStickBottom(duration?: number): Promise<void> {
    return this.tiltRStick(StickTiltPreset.Bottom, duration);
  }

  /**
   * Tilt RStick to Bottom Left for a specified duration.
   * @param duration
   */
  async tiltRStickBottomLeft(duration?: number): Promise<void> {
    return this.tiltRStick(StickTiltPreset.BottomLeft, duration);
  }

  /**
   * Tilt RStick to Left for a specified duration.
   * @param duration
   */
  async tiltRStickLeft(duration?: number): Promise<void> {
    return this.tiltRStick(StickTiltPreset.Left, duration);
  }

  /**
   * Tilt RStick to Top Left for a specified duration.
   * @param duration
   */
  async tiltRStickTopLeft(duration?: number): Promise<void> {
    return this.tiltRStick(StickTiltPreset.TopLeft, duration);
  }

  /**
   * Tilt RStick to Neutral for a specified duration.
   * @param duration
   */
  async tiltRStickNeutral(duration?: number): Promise<void> {
    return this.tiltRStick(StickTiltPreset.Neutral, duration);
  }

  /**
   * A function executed to have the Nintendo Switch recognize the controller.
   * The controller is recognized by pressing buttons multiple times.
   * @param buttons
   * @param duration
   * @param interval
   */
  async getRecognition(
    buttons: Button[] = [Button.ZL],
    duration?: number,
    interval?: number,
  ): Promise<void> {
    return this.controller.sendRepeat(
      (state) => {
        state.buttons.hold(buttons);
      },
      {
        times: 3,
        duration: duration ?? this.defaultDuration,
        interval: interval,
      },
    );
  }

  /**
   * Wait for a specified duration.
   * This is intended to be executed when a long wait is required.
   * It checks periodically whether the command has been canceled.
   * If the command has been canceled, the method's execution is interrupted by throwing an error.
   * @param duration
   * @param checkInterval
   */
  async waitPatiently(duration: number, checkInterval = 1.0): Promise<void> {
    const interval = checkInterval <= 0 ? 1.0 : checkInterval;

    for (let i = 0; i < duration / interval; i++) {
      await this.wait(interval);
      if (this.isCancelled) {
        throw new CommandCancelledError();
      }
    }
  }

  /**
   * Go to the home screen.
   */
  @checkCancelled()
  async gotoHomeScreen(): Promise<void> {
    await this.pressHome(100);
    await this.wait(1000);
  }

  /**
   * A method that shifts the Nintendo Switch's current time by the specified `diff`.
   * @param diff
   * @param toggleAuto
   * @param withReset
   */
  async shiftTime(
    diff: {
      years?: number;
      months?: number;
      days?: number;
      hours?: number;
      minutes?: number;
    },
    toggleAuto: boolean,
    withReset: boolean,
  ): Promise<void> {
    const { years = 0, months = 0, days = 0, hours = 0, minutes = 0 } = diff;

    // Go to the home screen
    await this.gotoHomeScreen();

    // Go to the System Settings
    await this.tiltLStickBottom(100);
    for (let i = 0; i < 5; i++) {
      await this.tiltLStickRight(100);
      await this.wait(100);
    }
    await this.pressA(100);
    await this.wait(1500);
    this.checkCancelled();

    // Go to System
    for (let i = 0; i < 2; i++) {
      await this.tiltLStickBottom(100);
      await this.wait(100);
    }
    await this.wait(300);
    await this.pressA(100);
    await this.wait(200);
    this.checkCancelled();

    // Go to Date and Time
    await this.tiltLStickBottom(700);
    await this.wait(200);
    await this.pressA(100);
    await this.wait(200);
    this.checkCancelled();

    // Reset the date and time
    if (withReset) {
      await this.pressA(100);
      await this.wait(200);
      await this.pressA(100);
      await this.wait(200);
    }
    this.checkCancelled();

    // Toggle Auto Time Sync Setting
    if (toggleAuto) {
      await this.pressA(100);
      await this.wait(200);
    }
    this.checkCancelled();

    // Go to Current Date and Time
    for (let i = 0; i < 2; i++) {
      await this.tiltLStickBottom(100);
      await this.wait(100);
    }
    await this.pressA(100);
    await this.wait(200);
    this.checkCancelled();

    // Set the date and time
    const shiftTime = async (diff: number) => {
      const tiltStick = diff < 0 ? this.tiltLStickBottom : this.tiltLStickTop;
      for (let i = 0; i < Math.abs(diff); i++) {
        await tiltStick(100);
        await this.wait(100);
        this.checkCancelled();
      }
      await this.tiltLStickRight(100);
      await this.wait(100);
    };
    for (const d of [years, months, days, hours, minutes]) {
      await shiftTime(d);
      this.checkCancelled();
    }
    await this.pressA(100);
  }

  /**
   * Check whether the command has been cancelled.
   * @private
   */
  private checkCancelled() {
    if (this.isCancelled) {
      throw new CommandCancelledError();
    }
  }
}
