import { stateChangerByGamepad } from '@renderer/utils/state-changer';
import type { Controller } from '@switch-software-controller/controller-api';
import { useCallback, useMemo, useState } from 'react';

export function useGamepad(controller: Controller, gamepadId: string) {
  const controller_ = useMemo(() => controller, [controller]);
  const id = useMemo(() => gamepadId, [gamepadId]);
  const [requestId, setRequestId] = useState<number>(null);

  const gamepadFrame = useCallback(
    (timestamp: DOMHighResTimeStamp) => {
      console.log(`[Debug] gamepad frame: ${timestamp}, ${id}`);
      const gamepad = navigator
        .getGamepads()
        .filter((gamepad) => gamepad !== null && gamepad !== undefined)
        .find((gamepad) => gamepad.id === id);
      controller_.send(stateChangerByGamepad(gamepad))
        .then(() => {
          setRequestId(requestAnimationFrame(gamepadFrame));
        })
        .catch((err) => console.error(`[Error] send: ${err}`));
    },
    [controller_, id],
  );

  const start = useCallback(() => {
    setRequestId(requestAnimationFrame(gamepadFrame));
  }, [gamepadFrame]);
  const cancel = useCallback(() => {
    if (requestId !== null) {
      cancelAnimationFrame(requestId);
      setRequestId(null);
    }
  }, [requestId]);

  return {
    startUpdateGamepad: start,
    cancelUpdateGamepad: cancel,
  };
}

export function useGamepads() {
  const [gamepads, setGamepads] = useState<Gamepad[]>([]);
  const [selectedGamepad, setSelectedGamepad] = useState<Gamepad | null>(null);

  const updateGamepads = useCallback(() => {
    const gamepads = navigator
      .getGamepads()
      .filter((gamepad) => gamepad !== null && gamepad !== undefined);
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

  return {
    gamepads,
    selectedGamepad,
    updateGamepads,
    selectGamepad,
  };
}
