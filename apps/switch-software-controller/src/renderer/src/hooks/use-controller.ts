import {
  ButtonStateImpl,
  ControllerImpl,
  ControllerStateImpl,
  HatStateImpl,
  StickStateImpl,
} from '@switch-software-controller/controller';
import type {
  Controller,
  ControllerState,
} from '@switch-software-controller/controller-api';
import type { SerialPort } from '@switch-software-controller/serial-port-api';
import { useMemo } from 'react';

export function useController(serialPort: SerialPort) {
  const state = useMemo<ControllerState>(
    () =>
      new ControllerStateImpl(
        new ButtonStateImpl(),
        new HatStateImpl(),
        new StickStateImpl(),
        new StickStateImpl(),
      ),
    [],
  );
  const controller = useMemo<Controller>(
    () => new ControllerImpl(state, serialPort),
    [state, serialPort],
  );

  return {
    controller,
  };
}
