import type {
  SerialPort as Base,
  SerialPortOpenOptions,
} from '@switch-software-controller/serial-port-api';
import { SerialPort } from 'serialport';

export type SerialPortInfo = {
  path: string;
  serialNumber: string | undefined;
  productId: string | undefined;
  vendorId: string | undefined;
};

export function listSerialPort(): Promise<SerialPortInfo[]> {
  return SerialPort.list();
}

export class SerialPortImpl implements Base {
  private port: SerialPort = undefined;

  async open(options: SerialPortOpenOptions): Promise<void> {
    if (this.port !== undefined) {
      await this.close();
    }
    try {
      this.port = new SerialPort({
        path: options.path,
        baudRate: options.baudRate,
      });
    } catch (err) {
      console.log(`[Error] open: ${err}`);
    }
  }

  async close(): Promise<void> {
    if (this.port !== undefined) {
      this.port.close((e) => {
        console.log(`[Error] close: ${e}`);
      });
    }
  }

  async write(data: string): Promise<void> {
    if (this.port !== undefined) {
      this.port.write(data, 'utf-8', (e) => {
        console.log(`[Error] write: ${e}`);
      });
    }
  }

  async writeLine(data: string): Promise<void> {
    await this.write(`${data}\r\n`);
  }
}
