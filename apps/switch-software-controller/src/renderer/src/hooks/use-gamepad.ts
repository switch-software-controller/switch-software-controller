import { stateChangerByGamepad } from '@renderer/utils/state-changer';
import type { Controller } from '@switch-software-controller/controller-api';
import { useCallback, useMemo, useState } from 'react';

export function useGamepad(controller: Controller, gamepadId: string) {
  const controller_ = useMemo(() => controller, [controller]);
  const id = useMemo(() => gamepadId, [gamepadId]);
  const [lastChanged, setLastChanged] = useState<number>(0);
  const [requestId, setRequestId] = useState<number>(null);

  const gamepadFrame = useCallback(
    (timestamp: DOMHighResTimeStamp) => {
      const gamepad = navigator
        .getGamepads()
        .filter((gamepad) => gamepad !== null && gamepad !== undefined)
        .find((gamepad) => gamepad.id === id);
      if (gamepad && gamepad.timestamp > lastChanged) {
        setLastChanged(gamepad.timestamp);
        controller_.send(stateChangerByGamepad(gamepad));
      }
      requestAnimationFrame(gamepadFrame);
    },
    [controller_, id, lastChanged],
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
