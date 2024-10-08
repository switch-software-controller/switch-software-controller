import { beforeEach, describe, expect, it, vi } from "vitest";
import { Button } from "./button.ts";
import {
  ControllerImpl,
  type SerializedStateSender,
  StatelessControllerImpl,
} from "./controller.ts";
import { ControllerState } from "./state.ts";
import { StickTiltPreset } from "./stick-tilt.ts";

describe(ControllerImpl, () => {
  let controller: ControllerImpl;
  let sender: SerializedStateSender;
  let wait: (duration: number) => Promise<void>;

  beforeEach(() => {
    sender = (() => {
      const cnstrct = vi.fn(() => {});
      let isOpen = true;
      cnstrct.prototype.close = vi.fn(() => {
        isOpen = false;
      });
      cnstrct.prototype.send = vi.fn(() => {});
      const s = new cnstrct();
      Object.defineProperty(s, "isOpen", {
        get: () => isOpen,
      });
      return s as unknown as SerializedStateSender;
    })();

    wait = vi.fn((_) => Promise.resolve());

    controller = new ControllerImpl(new ControllerState(), sender, wait);
  });

  describe("close", () => {
    it("should close the controller", () => {
      expect(controller.isOpen).toBe(true);
      controller.close();
      expect(controller.isOpen).toBe(false);
    });
  });

  describe("sendHold", () => {
    it("should send the serialized state to the device", () => {
      const spy = vi.spyOn(sender, "send");
      function stateChanger(state: ControllerState) {
        state.buttons.hold([0]);
      }

      const expectedState = new ControllerState();
      stateChanger(expectedState);

      controller.sendHold(stateChanger);
      expect(spy).toHaveBeenCalledWith(expectedState.serialize());
    });
  });

  describe("sendReset", () => {
    it("should reset the controller", () => {
      const spy = vi.spyOn(sender, "send");

      const expectedState = new ControllerState();
      expectedState.resetAll();

      controller.sendReset();
      expect(spy).toHaveBeenCalledWith(expectedState.serialize());
    });

    it("should reset the controller", () => {
      const spy = vi.spyOn(sender, "send");
      function stateChanger(state: ControllerState) {
        state.buttons.hold([0]);
      }

      const expectedState = new ControllerState();
      stateChanger(expectedState);
      stateChanger(controller.state);
      expectedState.resetAll();

      controller.sendReset();
      expect(spy).toHaveBeenCalledWith(expectedState.serialize());
    });
  });

  describe("sendWithReset", () => {
    it("should send the state with reset after wait in duration", async () => {
      const spy = vi.spyOn(sender, "send");
      const duration = 1000;
      function stateChanger(state: ControllerState) {
        state.buttons.hold([Button.A]);
      }

      const expectedState = new ControllerState();
      stateChanger(expectedState);
      const callArgs = [expectedState.serialize()];
      expectedState.resetAll();
      callArgs.push(expectedState.serialize());

      await controller.sendWithReset(stateChanger, duration);
      expect(spy.mock.calls[0]).toEqual([callArgs[0]]);
      expect(spy.mock.calls[1]).toEqual([callArgs[1]]);
      expect(wait).toHaveBeenCalledWith(duration);
    });
  });

  describe("sendRepeat", () => {
    it("should not send the state repeat if times < 1", async () => {
      const spy = vi.spyOn(sender, "send");
      function stateChanger(state: ControllerState) {
        state.buttons.hold([Button.A]);
      }

      const expectedState = new ControllerState();
      stateChanger(expectedState);
      const callArgs = [expectedState.serialize()];
      expectedState.resetAll();
      callArgs.push(expectedState.serialize());

      await controller.sendRepeat(stateChanger);
      expect(spy).toBeCalledTimes(2);
      expect(spy.mock.calls[0]).toEqual([callArgs[0]]);
      expect(spy.mock.calls[1]).toEqual([callArgs[1]]);
      expect(wait).toBeCalledTimes(2);
      expect(wait).nthCalledWith(1, 100); // default duration
      expect(wait).nthCalledWith(2, 100); // default interval
    });

    it("should not send the state repeat if times < 1", async () => {
      const spy = vi.spyOn(sender, "send");
      const options = {
        times: 0,
        duration: 1000,
        interval: 500,
        skipInterval: false,
      };
      function stateChanger(state: ControllerState) {
        state.buttons.hold([Button.A]);
      }

      await controller.sendRepeat(stateChanger, options);
      expect(spy).not.toHaveBeenCalled();
    });

    it("should send the state repeat", async () => {
      const spy = vi.spyOn(sender, "send");
      const options = {
        times: 3,
        duration: 1000,
        interval: 500,
        skipLastInterval: false,
      };
      function stateChanger(state: ControllerState) {
        state.buttons.hold([Button.A]);
        state.lStick.tilt = StickTiltPreset.Top;
      }

      const expectedState = new ControllerState();
      stateChanger(expectedState);
      const callArgs = [expectedState.serialize()];
      expectedState.consumeSticks();
      expectedState.resetAll();
      callArgs.push(expectedState.serialize());

      await controller.sendRepeat(stateChanger, options);
      expect(spy.mock.calls[0]).toEqual([callArgs[0]]);
      expect(spy.mock.calls[1]).toEqual([callArgs[1]]);
      expect(spy.mock.calls[2]).toEqual([callArgs[0]]);
      expect(spy.mock.calls[3]).toEqual([callArgs[1]]);
      expect(spy.mock.calls[4]).toEqual([callArgs[0]]);
      expect(spy.mock.calls[5]).toEqual([callArgs[1]]);
      expect(wait).toBeCalledTimes(6);
      expect(wait).nthCalledWith(1, options.duration);
      expect(wait).nthCalledWith(2, options.interval);
      expect(wait).nthCalledWith(3, options.duration);
      expect(wait).nthCalledWith(4, options.interval);
      expect(wait).nthCalledWith(5, options.duration);
      expect(wait).nthCalledWith(6, options.interval);
    });

    it("should send the state repeat with skip last interval", async () => {
      const spy = vi.spyOn(sender, "send");
      const options = {
        times: 3,
        duration: 1000,
        interval: 500,
        skipLastInterval: true,
      };
      function stateChanger(state: ControllerState) {
        state.buttons.hold([Button.A]);
        state.lStick.tilt = StickTiltPreset.Top;
      }

      const expectedState = new ControllerState();
      stateChanger(expectedState);
      const callArgs = [expectedState.serialize()];
      expectedState.consumeSticks();
      expectedState.resetAll();
      callArgs.push(expectedState.serialize());

      await controller.sendRepeat(stateChanger, options);
      expect(spy.mock.calls[0]).toEqual([callArgs[0]]);
      expect(spy.mock.calls[1]).toEqual([callArgs[1]]);
      expect(spy.mock.calls[2]).toEqual([callArgs[0]]);
      expect(spy.mock.calls[3]).toEqual([callArgs[1]]);
      expect(spy.mock.calls[4]).toEqual([callArgs[0]]);
      expect(spy.mock.calls[5]).toEqual([callArgs[1]]);
      expect(wait).toBeCalledTimes(5);
      expect(wait).nthCalledWith(1, options.duration);
      expect(wait).nthCalledWith(2, options.interval);
      expect(wait).nthCalledWith(3, options.duration);
      expect(wait).nthCalledWith(4, options.interval);
      expect(wait).nthCalledWith(5, options.duration);
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
      const expectedState = new ControllerState();
      const serializedState = expectedState.serialize();
      controller.send(serializedState);
      expect(spy).toHaveBeenCalledWith(serializedState);
    });
  });
});
