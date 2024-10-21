import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ControllerState } from "@switch-software-controller/controller-api";
import { ControllerImpl } from "./controller.ts";
import { ButtonStateImpl, ControllerStateImpl, HatStateImpl, StateSerializerImpl, StickStateImpl, } from "../state";
import type { SerializedStateSender } from "./serialized-state-sender.ts";

function createControllerState(): ControllerState {
  return new ControllerStateImpl(
    new StateSerializerImpl(),
    new ButtonStateImpl(),
    new HatStateImpl(),
    new StickStateImpl(),
    new StickStateImpl(),
  );
}

describe(ControllerImpl, () => {
  let controller: ControllerImpl;
  let sender: SerializedStateSender;

  beforeEach(() => {
    sender = (() => {
      // constructor
      const con = vi.fn(() => {});
      let isOpen = true;
      con.prototype.close = vi.fn(() => {
        isOpen = false;
      });
      con.prototype.send = vi.fn(() => {});
      const s = new con();
      Object.defineProperty(s, "isOpen", {
        get: () => isOpen,
      });
      return s as unknown as SerializedStateSender;
    })();

    controller = new ControllerImpl(createControllerState(), sender);
  });

  describe("close", () => {
    it("should close the controller", () => {
      expect(controller.isOpen).toBe(true);
      controller.close();
      expect(controller.isOpen).toBe(false);
    });
  });

  describe("send", () => {
    it("should send the serialized state to the device", () => {
      const spy = vi.spyOn(sender, "send");
      function stateChanger(state: ControllerState) {
        state.buttons.press([0]);
      }

      const expectedState = createControllerState();
      stateChanger(expectedState);

      controller.send(stateChanger);
      expect(spy).toHaveBeenCalledWith(expectedState.serialize());
    });
  });
});
