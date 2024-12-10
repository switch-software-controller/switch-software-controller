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
      const targets: USBDevice[] = [];
      const usbDevices = await navigator.usb.getDevices();
      for (const serial of await navigator.serial.getPorts()) {
        const serialInfo = serial.getInfo();
        const target = usbDevices.find((device) => device.vendorId === serialInfo.usbVendorId && device.productId === serialInfo.usbProductId);
        if (target !== undefined) {
          targets.push(target);
        }
      }
      setUsbDevices(targets);
      if (targets.length > 0) {
        setSelectedUsbDevice(targets[0]);
      } else {
        setSelectedUsbDevice(null)
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
