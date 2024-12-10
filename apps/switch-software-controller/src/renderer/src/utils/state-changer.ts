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
function groupButtons(buttons: readonly GamepadButton[]): [Button[], Button[]] {
  const pressed: Button[] = [];
  const released: Button[] = [];
  for (const [n, button] of buttonMap) {
    if (buttons[n].pressed) {
      pressed.push(button);
    } else {
      released.push(button);
    }
  }
  return [pressed, released];
}

// hat
const hatLookup: Hat[] = [
  /* 0000 */ Hat.Neutral,
  /* 0001 */ Hat.Right,
  /* 0010 */ Hat.Left,
  /* 0011 */ Hat.Neutral,
  /* 0100 */ Hat.Bottom,
  /* 0101 */ Hat.BottomRight,
  /* 0110 */ Hat.BottomLeft,
  /* 0111 */ Hat.Neutral,
  /* 1000 */ Hat.Top,
  /* 1001 */ Hat.TopRight,
  /* 1010 */ Hat.TopLeft,
  /* 1011 */ Hat.Neutral,
  /* 1100 */ Hat.Neutral,
  /* 1101 */ Hat.Neutral,
  /* 1110 */ Hat.Neutral,
  /* 1111 */ Hat.Neutral,
];
function identifyHat(buttons: readonly GamepadButton[]): Hat {
  const top = buttons[12].pressed ? 8 : 0;
  const bottom = buttons[13].pressed ? 4 : 0;
  const left = buttons[14].pressed ? 2 : 0;
  const right = buttons[15].pressed ? 1 : 0;
  return hatLookup[top | bottom | left | right];
}

// sticks
function calculateStickValues(axes: readonly number[]): number[] {
  const lx = Math.ceil(axes[0] * 127.5 + 127.5);
  const ly = Math.ceil(axes[1] * 127.5 + 127.5);
  const rx = Math.ceil(axes[2] * 127.5 + 127.5);
  const ry = Math.ceil(axes[3] * 127.5 + 127.5);
  return [lx, ly, rx, ry];
}

export function stateChangerByGamepad(gamepad: Gamepad): StateChanger {
  const [pressed, released] = groupButtons(gamepad.buttons);
  const hat: Hat = identifyHat(gamepad.buttons);
  const [lx, ly, rx, ry] = calculateStickValues(gamepad.axes);

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
