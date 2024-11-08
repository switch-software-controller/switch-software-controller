import type { SerialPort, SerialPortOpenOptions, } from '@switch-software-controller/serial-port-api';
import { useCallback, useState } from 'react';
import { SerialPortImpl } from '../libs/serial-port';

export function useUsb() {
  const [usbDevices, setUsbDevices] = useState<USBDevice[]>([]);
  const [selectedUsbDevice, setSelectedUsbDevice] = useState<USBDevice | null>(
    null,
  );
  const [connectedUsbDevice, setConnectedUsbDevice] =
    useState<SerialPort | null>(null);

  const updateUsbDevices = useCallback(() => {
    navigator.usb.getDevices().then((devices) => {
      setUsbDevices(devices);
    });
  }, []);

  const selectUsbDevice = useCallback(
    (id: string) => {
      const selected = usbDevices.find((device) => device.serialNumber === id);
      if (selected) {
        console.log(`selectedUsbDevice: ${selected.productName}`);
        setSelectedUsbDevice(selected);
      }
    },
    [usbDevices],
  );

  const connectUsbDevice = useCallback(
    (options: SerialPortOpenOptions) => {
      if (selectedUsbDevice) {
        navigator.serial.requestPort().then((port) => {
          if (port) {
            const serialPort = new SerialPortImpl(port, new TextEncoder());
            setConnectedUsbDevice(serialPort);
            serialPort.open(options);
          }
        });
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
