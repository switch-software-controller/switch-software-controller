import type {
  SerialPort,
  SerialPortOpenOptions,
} from '@switch-software-controller/serial-port-api';
import { useCallback, useState } from 'react';
import { SerialPortImpl } from '../libs/serial-port';

export function useUsb() {
  const [usbDevices, setUsbDevices] = useState<USBDevice[]>([]);
  const [selectedUsbDevice, setSelectedUsbDevice] = useState<USBDevice | null>(
    null,
  );
  const [connectedUsbDevice, setConnectedUsbDevice] =
    useState<SerialPort | null>(null);

  const updateUsbDevices = useCallback(async () => {
    try {
      const devices = await navigator.usb.getDevices();
      setUsbDevices(devices);
      if (devices.length > 0) {
        setSelectedUsbDevice(devices[0]);
      }
    } catch (err) {
      console.error(`[Error] update usb devices: ${err}`);
    }
  }, []);

  const selectUsbDevice = useCallback(
    (id: string) => {
      const selected = usbDevices.find((device) => device.serialNumber === id);
      if (selected) {
        console.debug(`[Debug] selected usb device: ${selected.productName}`);
        setSelectedUsbDevice(selected);
      }
    },
    [usbDevices],
  );

  const connectUsbDevice = useCallback(
    async (options: SerialPortOpenOptions) => {
      if (selectedUsbDevice) {
        try {
          const port = await navigator.serial.requestPort();
          if (port) {
            const serialPort = new SerialPortImpl(port, new TextEncoder());
            setConnectedUsbDevice(serialPort);
            await serialPort.open(options);
          }
        } catch (err) {
          console.error(`[Error] connect usb device: ${err}`);
        }
      }
    },
    [selectedUsbDevice],
  );

  return {
    usbDevices,
    updateUsbDevices,
    selectUsbDevice,
    connectUsbDevice,
    connectedUsbDevice,
  };
}
