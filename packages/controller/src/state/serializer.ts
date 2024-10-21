import type { ControllerState, StateSerializer, } from "@switch-software-controller/controller-api";

/**
 * Default Implementation of StateSerializer
 */
export class StateSerializerImpl implements StateSerializer {
  serialize(state: ControllerState): string {
    const hex = (n: number) => {
      return Number(n).toString(16);
    };

    let strL = "";
    let strR = "";

    let flag = state.buttons.value << 2;
    if (state.lStick.isDirty) {
      flag |= 0x2;
      strL = `${hex(state.lStick.x)} ${hex(state.lStick.y)}`;
    }
    if (state.rStick.isDirty) {
      flag |= 0x1;
      strR = `${hex(state.rStick.x)} ${hex(state.rStick.y)}`;
    }
    return `0x${hex(flag).padStart(4, "0")} ${state.hat.value} ${strL} ${strR}`;
  }
}
