import {
  Button,
  Hat,
  type StateChanger,
} from '@switch-software-controller/controller-api';

// buttons
const buttonMap: [number, Button][] = [
  [0, Button.B],
  [1, Button.A],
  [2, Button.Y],
  [3, Button.X],
  [4, Button.L],
  [5, Button.R],
  [6, Button.ZL],
  [7, Button.ZR],
  [8, Button.Minus],
  [9, Button.Plus],
  [10, Button.LStick],
  [11, Button.RStick],
  [16, Button.Home],
  [17, Button.Capture],
];
function groupButtons(buttons: readonly GamepadButton[]): {
  pressed: Button[];
  released: Button[];
} {
  const pressed: Button[] = [];
  const released: Button[] = [];
  for (const [n, button] of buttonMap) {
    if (buttons[n].pressed) {
      pressed.push(button);
    } else {
      released.push(button);
    }
  }
  return { pressed, released };
}

// hat
const hatLookup: Hat[] = [
  /* rlbt */
  /* 0000 */ Hat.Neutral,
  /* 0001 */ Hat.Top,
  /* 0010 */ Hat.Bottom,
  /* 0011 */ Hat.Neutral,
  /* 0100 */ Hat.Left,
  /* 0101 */ Hat.TopLeft,
  /* 0110 */ Hat.BottomLeft,
  /* 0111 */ Hat.Left,
  /* 1000 */ Hat.Right,
  /* 1001 */ Hat.TopRight,
  /* 1010 */ Hat.BottomRight,
  /* 1011 */ Hat.Right,
  /* 1100 */ Hat.Neutral,
  /* 1101 */ Hat.Top,
  /* 1110 */ Hat.Bottom,
  /* 1111 */ Hat.Neutral,
];
function identifyHat(buttons: readonly GamepadButton[]): Hat {
  const r = buttons[12].pressed ? 0b1000 : 0;
  const l = buttons[13].pressed ? 0b0100 : 0;
  const b = buttons[14].pressed ? 0b0010 : 0;
  const t = buttons[15].pressed ? 0b0001 : 0;
  return hatLookup[r | l | b | t];
}

// sticks
function calculateStickValues(axes: readonly number[]): {
  lx: number;
  ly: number;
  rx: number;
  ry: number;
} {
  const lx = Math.ceil(axes[0] * 127.5 + 127.5);
  const ly = Math.ceil(axes[1] * 127.5 + 127.5);
  const rx = Math.ceil(axes[2] * 127.5 + 127.5);
  const ry = Math.ceil(axes[3] * 127.5 + 127.5);
  return { lx, ly, rx, ry };
}

export function stateChangerByGamepad(gamepad: Gamepad): StateChanger {
  const { pressed, released } = groupButtons(gamepad.buttons);
  const hat: Hat = identifyHat(gamepad.buttons);
  const { lx, ly, rx, ry } = calculateStickValues(gamepad.axes);

  return (state) => {
    state.buttons.press(pressed);
    state.buttons.release(released);
    state.hat.press(hat);
    state.lStick.x = lx;
    state.lStick.y = ly;
    state.rStick.x = rx;
    state.rStick.y = ry;
  };
}
