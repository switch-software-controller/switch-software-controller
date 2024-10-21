import { beforeEach, describe, expect, it } from "vitest";
import { Button, type ControllerState, Hat, StickTiltPreset, } from "@switch-software-controller/controller-api";
import { ButtonStateImpl, ControllerStateImpl, HatStateImpl, StateSerializerImpl, StickStateImpl, } from "./index.ts";
import { StickTiltPresetDefault } from "../primitives";

describe(StateSerializerImpl, () => {
  let serializer: StateSerializerImpl;
  let state: ControllerState;

  beforeEach(() => {
    serializer = new StateSerializerImpl();
    state = new ControllerStateImpl(
      serializer,
      new ButtonStateImpl(),
      new HatStateImpl(),
      new StickStateImpl(),
      new StickStateImpl(),
    );
  });

  describe("serialize", () => {
    it("should serialize the state", () => {
      expect(serializer.serialize(state)).toBe("0x0000 8  ");
    });

    it("should serialize the state", () => {
      state.buttons.press([Button.X, Button.LStick]);
      expect(serializer.serialize(state)).toBe("0x1020 8  ");
    });

    it("should serialize the state", () => {
      state.buttons.press([Button.X, Button.LStick]);
      state.hat.press(Hat.BottomLeft);
      state.lStick.tilt = StickTiltPresetDefault[StickTiltPreset.Right];
      state.rStick.tilt = StickTiltPresetDefault[StickTiltPreset.Left];
      expect(serializer.serialize(state)).toBe("0x1023 5 ff 7f 0 7f");
    });

    it("should serialize the state", () => {
      state.buttons.press([Button.X, Button.LStick]);
      state.hat.press(Hat.BottomLeft);
      state.lStick.tilt = StickTiltPresetDefault[StickTiltPreset.Right];
      expect(serializer.serialize(state)).toBe("0x1022 5 ff 7f ");
    });

    it("should serialize the state", () => {
      state.buttons.press([Button.X, Button.LStick]);
      state.hat.press(Hat.BottomLeft);
      state.rStick.tilt = StickTiltPresetDefault[StickTiltPreset.Left];
      expect(serializer.serialize(state)).toBe("0x1021 5  0 7f");
    });

    it("should serialize the state", () => {
      state.buttons.press([Button.X, Button.LStick]);
      state.hat.press(Hat.BottomLeft);
      state.rStick.tilt = StickTiltPresetDefault[StickTiltPreset.Left];
      state.consumeSticks();
      expect(serializer.serialize(state)).toBe("0x1020 5  ");
    });
  });
});
