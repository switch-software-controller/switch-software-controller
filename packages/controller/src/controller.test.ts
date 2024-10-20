import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ControllerState } from "@switch-software-controller/controller-api";
import {
  ControllerImpl,
  type SerializedStateSender,
  StatelessControllerImpl,
} from "./controller.ts";
import { ControllerStateImpl } from './state.ts';

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

    controller = new ControllerImpl(new ControllerStateImpl(), sender);
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

      const expectedState = new ControllerStateImpl();
      stateChanger(expectedState);

      controller.send(stateChanger);
      expect(spy).toHaveBeenCalledWith(expectedState.serialize());
    });
  });
});

describe(StatelessControllerImpl, () => {
  let controller: StatelessControllerImpl;
  let sender: SerializedStateSender;

  beforeEach(() => {
    sender = (() => {
      const cnstruct = vi.fn(() => {});
      let isOpen = true;
      cnstruct.prototype.close = vi.fn(() => {
        isOpen = false;
      });
      cnstruct.prototype.send = vi.fn(() => {});
      const s = new cnstruct();
      Object.defineProperty(s, "isOpen", {
        get: () => isOpen,
      });
      return s as unknown as SerializedStateSender;
    })();

    controller = new StatelessControllerImpl(sender);
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
      const expectedState = new ControllerStateImpl();
      const serializedState = expectedState.serialize();
      controller.send(serializedState);
      expect(spy).toHaveBeenCalledWith(serializedState);
    });
  });
});
