import {
  Button,
  type ControllerState,
  Hat,
  StickTiltPreset,
} from "@switch-software-controller/controller-api";
import type { SerialPort } from "@switch-software-controller/serial-port-api";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { StickTiltPresetDefault } from "../primitives";
import {
  ButtonStateImpl,
  ControllerStateImpl,
  HatStateImpl,
  StickStateImpl,
} from "../state";
import { ControllerImpl } from "./controller.ts";

function createControllerState(): ControllerState {
  return new ControllerStateImpl(
    new ButtonStateImpl(),
    new HatStateImpl(),
    new StickStateImpl(),
    new StickStateImpl(),
  );
}

describe(ControllerImpl, () => {
  let controller: ControllerImpl;
  let port: SerialPort;

  beforeEach(() => {
    port = (() => {
      // constructor
      const con = vi.fn(() => {});
      con.prototype.writeLine = vi.fn(() => {});
      const s = new con();
      return s as unknown as SerialPort;
    })();

    controller = new ControllerImpl(createControllerState(), port);
  });

  describe("send", () => {
    it("should send correct serialized state to the device", () => {
      const spy = vi.spyOn(port, "writeLine");
      function stateChanger() {}

      controller.send(stateChanger);
      expect(spy).toHaveBeenCalledWith("0x0000 8  ");
    });

    it("should send correct serialized state to the device", () => {
      const spy = vi.spyOn(port, "writeLine");
      function stateChanger(state: ControllerState) {
        state.buttons.press([Button.X, Button.LStick]);
      }

      controller.send(stateChanger);
      expect(spy).toHaveBeenCalledWith("0x1020 8  ");
    });

    it("should send correct serialized state to the device", () => {
      const spy = vi.spyOn(port, "writeLine");
      function stateChanger(state: ControllerState) {
        state.buttons.press([Button.X, Button.LStick]);
        state.hat.press(Hat.BottomLeft);
        state.lStick.tilt = StickTiltPresetDefault[StickTiltPreset.Right];
        state.rStick.tilt = StickTiltPresetDefault[StickTiltPreset.Left];
      }

      controller.send(stateChanger);
      expect(spy).toHaveBeenCalledWith("0x1023 5 ff 7f 0 7f");
    });

    it("should send correct serialized state to the device", () => {
      const spy = vi.spyOn(port, "writeLine");
      function stateChanger(state: ControllerState) {
        state.buttons.press([Button.X, Button.LStick]);
        state.hat.press(Hat.BottomLeft);
        state.lStick.tilt = StickTiltPresetDefault[StickTiltPreset.Right];
      }

      controller.send(stateChanger);
      expect(spy).toHaveBeenCalledWith("0x1022 5 ff 7f ");
    });

    it("should send correct serialized state to the device", () => {
      const spy = vi.spyOn(port, "writeLine");
      function stateChanger(state: ControllerState) {
        state.buttons.press([Button.X, Button.LStick]);
        state.hat.press(Hat.BottomLeft);
        state.rStick.tilt = StickTiltPresetDefault[StickTiltPreset.Left];
      }

      controller.send(stateChanger);
      expect(spy).toHaveBeenCalledWith("0x1021 5  0 7f");
    });

    it("should send correct serialized state to the device", () => {
      const spy = vi.spyOn(port, "writeLine");
      function stateChanger(state: ControllerState) {
        state.buttons.press([Button.X, Button.LStick]);
        state.hat.press(Hat.BottomLeft);
        state.rStick.tilt = StickTiltPresetDefault[StickTiltPreset.Left];
        state.consumeSticks();
      }

      controller.send(stateChanger);
      expect(spy).toHaveBeenCalledWith("0x1020 5  ");
    });
  });
});
