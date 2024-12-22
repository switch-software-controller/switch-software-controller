import {
  SerialPortImpl,
  type SerialPortInfo,
  listSerialPort,
} from '@renderer/libs/serial-port';
import type { SerialPortOpenOptions } from '@switch-software-controller/serial-port-api';
import { useCallback, useState } from 'react';

export function useSerialPorts() {
  const [serialPorts, setSerialPorts] = useState<SerialPortInfo[]>([]);
  const [selectedSerialPort, setSelectedSerialPort] =
    useState<SerialPortInfo | null>(null);
  const [connectedSerialPort, setConnectedSerialPort] =
    useState<SerialPortImpl | null>(null);

  const updateSerialPorts = useCallback(async () => {
    try {
      const ports = await listSerialPort();
      setSerialPorts(ports);
      if (ports.length > 0) {
        setSelectedSerialPort(ports[0]);
      } else {
        setSelectedSerialPort(null);
      }
    } catch (err) {
      console.error(`[Error] update serial ports: ${err}`);
    }
  }, []);

  const selectSerialPort = useCallback(
    (path: string) => {
      const selected = serialPorts.find((port) => port.path === path);
      if (selected) {
        console.debug(`[Debug] selected serial port: ${selected.path}`);
        setSelectedSerialPort(selected);
      }
    },
    [serialPorts],
  );

  const connectSelectedSerialPort = useCallback(
    async (options: SerialPortOpenOptions) => {
      if (selectedSerialPort) {
        try {
          const serialPort = new SerialPortImpl();
          setConnectedSerialPort(serialPort);
          await serialPort.open(options);
        } catch (err) {
          console.error(`[Error] connect serial port: ${err}`);
        }
      }
    },
    [selectedSerialPort],
  );

  return {
    serialPorts,
    updateSerialPorts,
    selectSerialPort,
    selectedSerialPort,
    connectSelectedSerialPort,
    connectedSerialPort,
  };
}
