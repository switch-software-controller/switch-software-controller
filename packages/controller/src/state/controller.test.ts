import {
  Button,
  Hat,
  StickTiltPreset,
} from '@switch-software-controller/controller-api';
import { beforeEach, describe, expect, it, test } from 'vitest';
import {
  ButtonValue,
  HatValue,
  StickTiltPresetDefault,
  StickTiltRange,
} from '../primitives';
import { ButtonStateImpl } from './button.ts';
import { ControllerStateImpl } from './controller.ts';
import { HatStateImpl } from './hat.ts';
import { StickStateImpl } from './stick.ts';

describe(ControllerStateImpl, () => {
  let state: ControllerStateImpl;

  beforeEach(() => {
    state = new ControllerStateImpl(
      new ButtonStateImpl(),
      new HatStateImpl(),
      new StickStateImpl(),
      new StickStateImpl(),
    );
  });

  test('initial state', () => {
    expect(state.isDirty).toBe(false);
    expect(state.buttons.value).toBe(Button.Noop);
    expect(state.hat.value).toBe(Hat.Neutral);
    expect(state.lStick.x).toBe(StickTiltRange.Center);
    expect(state.lStick.y).toBe(StickTiltRange.Center);
    expect(state.rStick.x).toBe(StickTiltRange.Center);
    expect(state.rStick.y).toBe(StickTiltRange.Center);
  });

  describe('state.buttons', () => {
    describe('press', () => {
      it('should set the value of the buttons', () => {
        state.buttons.press([Button.A, Button.B]);
        expect(state.buttons.value).toBe(
          ButtonValue[Button.A] | ButtonValue[Button.B],
        );
      });

      it('should idempotent hold Button.Noop', () => {
        state.buttons.press([Button.Noop]);
        expect(state.buttons.value).toBe(ButtonValue[Button.Noop]);
      });

      it('should idempotent hold Button.Noop', () => {
        state.buttons.press([Button.A, Button.B]);
        expect(state.buttons.value).toBe(
          ButtonValue[Button.A] | ButtonValue[Button.B],
        );
        state.buttons.press([Button.Noop]);
        expect(state.buttons.value).toBe(
          ButtonValue[Button.A] | ButtonValue[Button.B],
        );
      });
    });

    describe('release', () => {
      it('should set the value of the buttons', () => {
        state.buttons.press([Button.A, Button.B]);
        expect(state.buttons.value).toBe(
          ButtonValue[Button.A] | ButtonValue[Button.B],
        );
        state.buttons.release([Button.A]);
        expect(state.buttons.value).toBe(ButtonValue[Button.B]);
      });

      it('should idempotent release Button.Noop', () => {
        state.buttons.release([Button.Noop]);
        expect(state.buttons.value).toBe(ButtonValue[Button.Noop]);
      });

      it('should idempotent release Button.Noop', () => {
        state.buttons.press([Button.A, Button.B]);
        expect(state.buttons.value).toBe(
          ButtonValue[Button.A] | ButtonValue[Button.B],
        );
        state.buttons.release([Button.Noop]);
        expect(state.buttons.value).toBe(
          ButtonValue[Button.A] | ButtonValue[Button.B],
        );
      });
    });

    describe('reset', () => {
      it('should set the value of the buttons', () => {
        state.buttons.press([Button.A, Button.B]);
        expect(state.buttons.value).toBe(
          ButtonValue[Button.A] | ButtonValue[Button.B],
        );
        state.buttons.reset();
        expect(state.buttons.value).toBe(ButtonValue[Button.Noop]);
      });

      it('should idempotent reset if initial state', () => {
        expect(state.buttons.value).toBe(ButtonValue[Button.Noop]);
        state.buttons.reset();
        expect(state.buttons.value).toBe(ButtonValue[Button.Noop]);
      });

      it('should idempotent reset if already reset', () => {
        state.buttons.press([Button.A, Button.B]);
        expect(state.buttons.value).toBe(
          ButtonValue[Button.A] | ButtonValue[Button.B],
        );
        state.buttons.reset();
        expect(state.buttons.value).toBe(ButtonValue[Button.Noop]);
        state.buttons.reset();
        expect(state.buttons.value).toBe(ButtonValue[Button.Noop]);
      });
    });
  });

  describe('state.hat', () => {
    describe('press', () => {
      it('should set the value of the hat', () => {
        expect(state.hat.value).toBe(HatValue[Hat.Neutral]);
        state.hat.press(Hat.Top);
        expect(state.hat.value).toBe(HatValue[Hat.Top]);
      });

      it('should idempotent hold Hat.Top if current value is Hat.Top', () => {
        state.hat.press(Hat.Top);
        expect(state.hat.value).toBe(HatValue[Hat.Top]);
        state.hat.press(Hat.Top);
        expect(state.hat.value).toBe(HatValue[Hat.Top]);
      });
    });

    describe('reset', () => {
      it('should set the value to Hat.Neutral', () => {
        expect(state.hat.value).toBe(HatValue[Hat.Neutral]);
        state.hat.press(Hat.Top);
        expect(state.hat.value).toBe(HatValue[Hat.Top]);
        state.hat.reset();
        expect(state.hat.value).toBe(HatValue[Hat.Neutral]);
      });

      it('should idempotent release Hat.Neutral if current value is Hat.Neutral', () => {
        expect(state.hat.value).toBe(HatValue[Hat.Neutral]);
        state.hat.reset();
        expect(state.hat.value).toBe(HatValue[Hat.Neutral]);
      });
    });
  });

  describe('sticks of state', () => {
    describe('tilt', () => {
      it('should not dirty if not tilt changed', () => {
        for (const stick of [state.lStick, state.rStick]) {
          stick.tilt = StickTiltPresetDefault[StickTiltPreset.Neutral];
          expect(stick.x).toBe(StickTiltRange.Center);
          expect(stick.y).toBe(StickTiltRange.Center);
          expect(stick.isDirty).toBe(false);
        }
      });

      it('should dirty if tilt changed', () => {
        for (const stick of [state.lStick, state.rStick]) {
          stick.tilt = StickTiltPresetDefault[StickTiltPreset.Top];
          expect(stick.x).toBe(StickTiltPresetDefault[StickTiltPreset.Top].x);
          expect(stick.y).toBe(StickTiltPresetDefault[StickTiltPreset.Top].y);
          expect(stick.isDirty).toBe(true);
        }
      });
    });

    describe('tiltPreset', () => {
      it('should not dirty if not tilt changed', () => {
        for (const stick of [state.lStick, state.rStick]) {
          stick.tiltPreset = StickTiltPreset.Neutral;
          expect(stick.x).toBe(StickTiltRange.Center);
          expect(stick.y).toBe(StickTiltRange.Center);
          expect(stick.isDirty).toBe(false);
        }
      });

      it('should dirty if tilt changed', () => {
        for (const stick of [state.lStick, state.rStick]) {
          stick.tiltPreset = StickTiltPreset.Top;
          expect(stick.x).toBe(StickTiltPresetDefault[StickTiltPreset.Top].x);
          expect(stick.y).toBe(StickTiltPresetDefault[StickTiltPreset.Top].y);
          expect(stick.isDirty).toBe(true);
        }
      });
    });

    describe('consume', () => {
      it('should not dirty if not consume', () => {
        for (const stick of [state.lStick, state.rStick]) {
          stick.tilt = StickTiltPresetDefault[StickTiltPreset.Top];
          expect(stick.isDirty).toBe(true);
        }
      });

      it('should not dirty if consume', () => {
        for (const stick of [state.lStick, state.rStick]) {
          stick.tilt = StickTiltPresetDefault[StickTiltPreset.Top];
          expect(stick.isDirty).toBe(true);
          stick.consume();
          expect(stick.isDirty).toBe(false);
        }
      });
    });

    describe('reset', () => {
      it('should not dirty if tilt is already neutral', () => {
        for (const stick of [state.lStick, state.rStick]) {
          stick.reset();
          expect(stick.x).toBe(StickTiltRange.Center);
          expect(stick.y).toBe(StickTiltRange.Center);
          expect(stick.isDirty).toBe(false);
        }
      });

      it('should dirty if tilt is not neutral', () => {
        for (const stick of [state.lStick, state.rStick]) {
          stick.tilt = StickTiltPresetDefault[StickTiltPreset.Top];
          expect(stick.isDirty).toBe(true);
          stick.consume();
          expect(stick.isDirty).toBe(false);
          stick.reset();
          expect(stick.x).toBe(StickTiltRange.Center);
          expect(stick.y).toBe(StickTiltRange.Center);
          expect(stick.isDirty).toBe(true);
        }
      });
    });
  });

  describe('isDirty', () => {
    it('should be true if any state is dirty', () => {
      state.lStick.tilt = StickTiltPresetDefault[StickTiltPreset.Top];
      expect(state.isDirty).toBe(true);
    });

    it('should be false if all state is not dirty', () => {
      state.lStick.tilt = StickTiltPresetDefault[StickTiltPreset.Top];
      state.lStick.consume();
      expect(state.isDirty).toBe(false);
    });
  });

  describe('reset', () => {
    it('should reset all state', () => {
      state.buttons.press([Button.A, Button.B]);
      state.hat.press(Hat.Top);
      state.lStick.tilt = StickTiltPresetDefault[StickTiltPreset.Top];
      state.rStick.tilt = StickTiltPresetDefault[StickTiltPreset.Top];
      state.reset();

      expect(state.isDirty).toBe(true);
      expect(state.buttons.value).toBe(Button.Noop);
      expect(state.hat.value).toBe(Hat.Neutral);
      expect(state.lStick.x).toBe(StickTiltRange.Center);
      expect(state.lStick.y).toBe(StickTiltRange.Center);
      expect(state.rStick.x).toBe(StickTiltRange.Center);
      expect(state.rStick.y).toBe(StickTiltRange.Center);
    });
  });

  describe('consumeSticks', () => {
    it('should consume sticks', () => {
      state.lStick.tilt = StickTiltPresetDefault[StickTiltPreset.Top];
      state.rStick.tilt = StickTiltPresetDefault[StickTiltPreset.Top];
      state.consumeSticks();
      expect(state.lStick.isDirty).toBe(false);
      expect(state.rStick.isDirty).toBe(false);
    });
  });
});
