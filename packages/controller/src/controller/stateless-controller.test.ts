import type { ControllerState } from "@switch-software-controller/controller-api";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ButtonStateImpl,
  ControllerStateImpl,
  HatStateImpl,
  StateSerializerImpl,
  StickStateImpl,
} from "../state";
import type { SerializedStateSender } from "./serialized-state-sender.ts";
import { StatelessControllerImpl } from "./stateless-controller.ts";

function createControllerState(): ControllerState {
  return new ControllerStateImpl(
    new StateSerializerImpl(),
    new ButtonStateImpl(),
    new HatStateImpl(),
    new StickStateImpl(),
    new StickStateImpl(),
  );
}

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
      const expectedState = createControllerState();
      const serializedState = expectedState.serialize();
      controller.send(serializedState);
      expect(spy).toHaveBeenCalledWith(serializedState);
    });
  });
});
