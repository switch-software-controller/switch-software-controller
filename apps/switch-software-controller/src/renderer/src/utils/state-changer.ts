import {
  Button,
  Hat,
  type StateChanger,
} from '@switch-software-controller/controller-api';

/** Mapping of gamepad button indices to Switch controller buttons */
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

/**
 * Groups gamepad buttons into pressed and released arrays
 * 
 * @param buttons - Array of gamepad button states
 * @returns Object containing arrays of pressed and released buttons
 */
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

/** 
 * Lookup table for D-pad (hat) directions based on button combinations
 * 
 * Uses 4-bit encoding: Right(8) | Left(4) | Bottom(2) | Top(1)
 */
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

/**
 * Identifies the D-pad (hat) direction from gamepad button states
 * 
 * Maps buttons 12-15 (D-pad buttons) to hat directions using bit encoding.
 * 
 * @param buttons - Array of gamepad button states
 * @returns Hat direction corresponding to pressed D-pad buttons
 */
function identifyHat(buttons: readonly GamepadButton[]): Hat {
  const r = buttons[12].pressed ? 0b1000 : 0;
  const l = buttons[13].pressed ? 0b0100 : 0;
  const b = buttons[14].pressed ? 0b0010 : 0;
  const t = buttons[15].pressed ? 0b0001 : 0;
  return hatLookup[r | l | b | t];
}

/**
 * Calculates stick values from gamepad axes
 * 
 * Converts normalized axis values (-1 to 1) to Switch controller range (0-255).
 * 
 * @param axes - Array of gamepad axis values
 * @returns Object containing left and right stick coordinates
 */
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

/**
 * Creates a StateChanger function from gamepad input
 * 
 * Converts gamepad state (buttons, D-pad, and analog sticks) into a function
 * that can update Switch controller state. This enables direct gamepad-to-Switch
 * input mapping.
 * 
 * @param gamepad - The gamepad object to read input from
 * @returns StateChanger function that applies gamepad state to controller state
 */
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
