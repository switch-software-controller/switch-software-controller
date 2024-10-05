import { beforeEach, describe, expect, it, test } from "vitest";
import { Button } from "./button.ts";
import { Hat } from "./hat.ts";
import { ControllerState, StateSerializerImpl } from "./state.ts";
import { StickTiltPreset, StickTiltRange } from "./stick-tilt.ts";

describe(ControllerState, () => {
  let state: ControllerState;

  beforeEach(() => {
    state = new ControllerState();
  });

  test("initial state", () => {
    expect(state.isDirty).toBe(false);
    expect(state.buttons.value).toBe(Button.Noop);
    expect(state.hat.value).toBe(Hat.Neutral);
    expect(state.lStick.x).toBe(StickTiltRange.Center);
    expect(state.lStick.y).toBe(StickTiltRange.Center);
    expect(state.rStick.x).toBe(StickTiltRange.Center);
    expect(state.rStick.y).toBe(StickTiltRange.Center);
    expect(state.serialize()).toBe("0x0000 8  ");
  });

  describe("state.buttons", () => {
    describe("hold", () => {
      it("should set the value of the buttons", () => {
        state.buttons.hold([Button.A, Button.B]);
        expect(state.buttons.value).toBe(Button.A | Button.B);
      });

      it("should idempotent hold Button.Noop", () => {
        state.buttons.hold([Button.Noop]);
        expect(state.buttons.value).toBe(Button.Noop);
      });

      it("should idempotent hold Button.Noop", () => {
        state.buttons.hold([Button.A, Button.B]);
        state.buttons.hold([Button.Noop]);
        expect(state.buttons.value).toBe(Button.A | Button.B);
      });
    });

    describe("release", () => {
      it("should set the value of the buttons", () => {
        state.buttons.hold([Button.A, Button.B]);
        state.buttons.release([Button.A]);
        expect(state.buttons.value).toBe(Button.B);
      });

      it("should idempotent release Button.Noop", () => {
        state.buttons.release([Button.Noop]);
        expect(state.buttons.value).toBe(Button.Noop);
      });

      it("should idempotent release Button.Noop", () => {
        state.buttons.hold([Button.A, Button.B]);
        state.buttons.release([Button.Noop]);
        expect(state.buttons.value).toBe(Button.A | Button.B);
      });
    });

    describe("releaseAll", () => {
      it("should set the value of the buttons", () => {
        state.buttons.hold([Button.A, Button.B]);
        state.buttons.releaseAll();
        expect(state.buttons.value).toBe(Button.Noop);
      });

      it("should idempotent releaseAll if initial state", () => {
        state.buttons.releaseAll();
        expect(state.buttons.value).toBe(Button.Noop);
      });

      it("should idempotent releaseAll if already reset", () => {
        state.buttons.hold([Button.A, Button.B]);
        state.buttons.releaseAll();
        state.buttons.releaseAll();
        expect(state.buttons.value).toBe(Button.Noop);
      });
    });
  });

  describe("state.hat", () => {
    describe("hold", () => {
      it("should set the value of the hat", () => {
        state.hat.hold(Hat.Top);
        expect(state.hat.value).toBe(Hat.Top);
      });

      it("should idempotent hold Hat.Top if current value is Hat.Top", () => {
        state.hat.hold(Hat.Top);
        state.hat.hold(Hat.Top);
        expect(state.hat.value).toBe(Hat.Top);
      });
    });

    describe("release", () => {
      it("should set the value to Hat.Neutral", () => {
        state.hat.hold(Hat.Top);
        state.hat.release();
        expect(state.hat.value).toBe(Hat.Neutral);
      });

      it("should idempotent release Hat.Neutral if current value is Hat.Neutral", () => {
        state.hat.release();
        expect(state.hat.value).toBe(Hat.Neutral);
      });
    });
  });

  describe("sticks of state", () => {
    describe("tilt", () => {
      it("should not dirty if not tilt changed", () => {
        for (const stick of [state.lStick, state.rStick]) {
          stick.tilt = StickTiltPreset.Neutral;
          expect(stick.x).toBe(StickTiltRange.Center);
          expect(stick.y).toBe(StickTiltRange.Center);
          expect(stick.isDirty).toBe(false);
        }
      });

      it("should dirty if tilt changed", () => {
        for (const stick of [state.lStick, state.rStick]) {
          stick.tilt = StickTiltPreset.Top;
          expect(stick.x).toBe(StickTiltPreset.Top.x);
          expect(stick.y).toBe(StickTiltPreset.Top.y);
          expect(stick.isDirty).toBe(true);
        }
      });
    });

    describe("consume", () => {
      it("should not dirty if not consume", () => {
        for (const stick of [state.lStick, state.rStick]) {
          stick.tilt = StickTiltPreset.Top;
          expect(stick.isDirty).toBe(true);
        }
      });

      it("should not dirty if consume", () => {
        for (const stick of [state.lStick, state.rStick]) {
          stick.tilt = StickTiltPreset.Top;
          expect(stick.isDirty).toBe(true);
          stick.consume();
          expect(stick.isDirty).toBe(false);
        }
      });
    });

    describe("toNeutral", () => {
      it("should not dirty if tilt is already neutral", () => {
        for (const stick of [state.lStick, state.rStick]) {
          stick.toNeutral();
          expect(stick.x).toBe(StickTiltRange.Center);
          expect(stick.y).toBe(StickTiltRange.Center);
          expect(stick.isDirty).toBe(false);
        }
      });

      it("should dirty if tilt is not neutral", () => {
        for (const stick of [state.lStick, state.rStick]) {
          stick.tilt = StickTiltPreset.Top;
          expect(stick.isDirty).toBe(true);
          stick.consume();
          expect(stick.isDirty).toBe(false);
          stick.toNeutral();
          expect(stick.x).toBe(StickTiltRange.Center);
          expect(stick.y).toBe(StickTiltRange.Center);
          expect(stick.isDirty).toBe(true);
        }
      });
    });
  });

  describe("isDirty", () => {
    it("should be true if any state is dirty", () => {
      state.lStick.tilt = StickTiltPreset.Top;
      expect(state.isDirty).toBe(true);
    });

    it("should be false if all state is not dirty", () => {
      state.lStick.tilt = StickTiltPreset.Top;
      state.lStick.consume();
      expect(state.isDirty).toBe(false);
    });
  });

  describe("resetAll", () => {
    it("should reset all state", () => {
      state.buttons.hold([Button.A, Button.B]);
      state.hat.hold(Hat.Top);
      state.lStick.tilt = StickTiltPreset.Top;
      state.rStick.tilt = StickTiltPreset.Top;
      state.resetAll();

      expect(state.isDirty).toBe(true);
      expect(state.buttons.value).toBe(Button.Noop);
      expect(state.hat.value).toBe(Hat.Neutral);
      expect(state.lStick.x).toBe(StickTiltRange.Center);
      expect(state.lStick.y).toBe(StickTiltRange.Center);
      expect(state.rStick.x).toBe(StickTiltRange.Center);
      expect(state.rStick.y).toBe(StickTiltRange.Center);
      expect(state.serialize()).toBe("0x0003 8 80 80 80 80");
    });
  });

  describe("consumeSticks", () => {
    it("should consume sticks", () => {
      state.lStick.tilt = StickTiltPreset.Top;
      state.rStick.tilt = StickTiltPreset.Top;
      state.consumeSticks();
      expect(state.lStick.isDirty).toBe(false);
      expect(state.rStick.isDirty).toBe(false);
    });
  });

  describe("serialize", () => {
    it("should serialize the state", () => {
      state.buttons.hold([Button.A, Button.B]);
      state.hat.hold(Hat.Top);
      state.lStick.tilt = StickTiltPreset.Top;
      state.rStick.tilt = StickTiltPreset.Top;
      expect(state.serialize()).toBe("0x001b 0 80 0 80 0");
    });

    it("should serialize the state", () => {
      state.buttons.hold([Button.A, Button.B, Button.Noop]);
      state.hat.hold(Hat.Top);
      state.lStick.tilt = StickTiltPreset.Top;
      state.rStick.tilt = StickTiltPreset.Top;
      expect(state.serialize()).toBe("0x001b 0 80 0 80 0");
    });
  });
});

describe(StateSerializerImpl, () => {
  let serializer: StateSerializerImpl;
  let state: ControllerState;

  beforeEach(() => {
    serializer = new StateSerializerImpl();
    state = new ControllerState();
  });

  describe("serialize", () => {
    it("should serialize the state", () => {
      expect(serializer.serialize(state)).toBe("0x0000 8  ");
    });

    it("should serialize the state", () => {
      state.buttons.hold([Button.X, Button.LStick]);
      expect(serializer.serialize(state)).toBe("0x1020 8  ");
    });

    it("should serialize the state", () => {
      state.buttons.hold([Button.X, Button.LStick]);
      state.hat.hold(Hat.BottomLeft);
      state.lStick.tilt = StickTiltPreset.Right;
      state.rStick.tilt = StickTiltPreset.Left;
      expect(serializer.serialize(state)).toBe("0x1023 5 ff 7f 0 7f");
    });

    it("should serialize the state", () => {
      state.buttons.hold([Button.X, Button.LStick]);
      state.hat.hold(Hat.BottomLeft);
      state.lStick.tilt = StickTiltPreset.Right;
      expect(serializer.serialize(state)).toBe("0x1022 5 ff 7f ");
    });

    it("should serialize the state", () => {
      state.buttons.hold([Button.X, Button.LStick]);
      state.hat.hold(Hat.BottomLeft);
      state.rStick.tilt = StickTiltPreset.Left;
      expect(serializer.serialize(state)).toBe("0x1021 5  0 7f");
    });

    it("should serialize the state", () => {
      state.buttons.hold([Button.X, Button.LStick]);
      state.hat.hold(Hat.BottomLeft);
      state.rStick.tilt = StickTiltPreset.Left;
      state.consumeSticks();
      expect(serializer.serialize(state)).toBe("0x1020 5  ");
    });
  });
});
