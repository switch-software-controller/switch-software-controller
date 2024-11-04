import {
  Button,
  type Controller,
  Hat,
} from '@switch-software-controller/controller-api';
import { useCallback, useState } from 'react';

export function useGamepad(controller: Controller) {
  const [requestId, setRequestId] = useState<number>(null);
  const [gamepads, setGamepads] = useState<Gamepad[]>([]);
  const [selectedGamepad, setSelectedGamepad] = useState<Gamepad | null>(null);
  const [lastChanged, setLastChanged] = useState<{[key: string]: number}>({});

  const updateGamepads = useCallback(() => {
    const gamepads = navigator.getGamepads().filter((gamepad) => gamepad);
    setGamepads(gamepads);
    if (gamepads.length > 0) {
      setSelectedGamepad(gamepads[0]);
    }
  }, []);

  const selectGamepad = useCallback(
    (id: string) => {
      const selected = gamepads.find((gamepad) => gamepad.id === id);
      if (selected) {
        setSelectedGamepad(selected);
      }
    },
    [gamepads],
  );

  const gamepadFrame = useCallback(
    (timestamp: DOMHighResTimeStamp) => {
      for (const gamepad of navigator.getGamepads()) {
        // continue if not target gamepads.
        if (!gamepad || !selectedGamepad || gamepad.id !== selectedGamepad.id) {
          continue;
        }
        // continue if the gamepad is not changed.
        if (gamepad.timestamp <= (lastChanged[gamepad.id] ?? 0)) {
          continue;
        }
        setLastChanged({ ...lastChanged, [gamepad.id]: gamepad.timestamp });

        // buttons
        const pressed: Button[] = [];
        const released: Button[] = [];
        const buttons: { [key: number]: Button } = {
          0: Button.B,
          1: Button.A,
          2: Button.Y,
          3: Button.X,
          4: Button.L,
          5: Button.R,
          6: Button.ZL,
          7: Button.ZR,
          8: Button.Minus,
          9: Button.Plus,
          10: Button.LStick,
          11: Button.RStick,
          16: Button.Home,
          17: Button.Capture,
        };
        for (const key of Object.keys(buttons)) {
          const k = Number.parseInt(key, 10);
          if (gamepad.buttons[k].pressed) {
            pressed.push(buttons[k]);
          } else {
            released.push(buttons[k]);
          }
        }

        // hat
        let hat: Hat = Hat.Neutral;
        const top = gamepad.buttons[12].pressed;
        const bottom = gamepad.buttons[13].pressed;
        const left = gamepad.buttons[14].pressed;
        const right = gamepad.buttons[15].pressed;
        if (top && left) {
          hat = Hat.TopLeft;
        } else if (top && right) {
          hat = Hat.TopRight;
        } else if (top) {
          hat = Hat.Top;
        } else if (bottom && left) {
          hat = Hat.BottomLeft;
        } else if (bottom && right) {
          hat = Hat.BottomRight;
        } else if (bottom) {
          hat = Hat.Bottom;
        } else if (right) {
          hat = Hat.Right;
        } else { // left
          hat = Hat.Left;
        }

        // sticks
        const normalizeStick = (value: number) => Math.ceil(value * 127.5 + 127.5);
        const lx = normalizeStick(gamepad.axes[0]);
        const ly = normalizeStick(gamepad.axes[1]);
        const rx = normalizeStick(gamepad.axes[2]);
        const ry = normalizeStick(gamepad.axes[3]);

        controller.send((state) => {
          state.buttons.press(pressed);
          state.buttons.release(released);
          state.hat.press(hat);
          state.lStick.x = lx;
          state.lStick.y = ly;
          state.rStick.x = rx;
          state.rStick.y = ry;
        });
      }
      setRequestId(requestAnimationFrame(gamepadFrame));
    },
    [controller, lastChanged, selectedGamepad],
  );
  const startGamepad = useCallback(() => {
    setRequestId(requestAnimationFrame(gamepadFrame));
  }, [gamepadFrame]);
  const cancelGamepad = useCallback(() => {
    if (requestId) {
      cancelAnimationFrame(requestId);
    }
  }, [requestId]);

  return {
    gamepads,
    updateGamepads,
    selectGamepad,
    startGamepad,
    cancelGamepad,
  };
}
