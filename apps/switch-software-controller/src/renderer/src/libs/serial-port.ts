import type {
  SerialPort as Base,
  SerialPortOpenOptions,
} from '@switch-software-controller/serial-port-api';

export interface Encoder {
  encode(data: string): Uint8Array;
}

export class SerialPortImpl implements Base {
  private writer_: WritableStreamDefaultWriter<Uint8Array> | null = null;
  private readonly port: SerialPort;
  private readonly encoder: Encoder;

  constructor(port: SerialPort, encoder: Encoder) {
    this.port = port;
    this.encoder = encoder;
  }

  private get writer(): WritableStreamDefaultWriter<Uint8Array> {
    if (!this.writer_) {
      this.writer_ = this.port.writable.getWriter();
    }
    return this.writer_;
  }

  async open(options: SerialPortOpenOptions): Promise<void> {
    try {
      await this.port.open(options)
    } catch (err) {
      console.log(`[Error] open: ${err}`);
    }
  }

  async close(): Promise<void> {
    try {
      await this.port.close();
    } catch (err) {
      console.log(`[Error] close: ${err}`);
    }
  }

  async write(data: string): Promise<void> {
    console.debug(`[Debug] write: ${data}`);
    try {
      const encoded = this.encoder.encode(data);
      await this.writer.write(encoded);
      const hex = Array.from(encoded).map((n) => `0x${n.toString(16).padStart(2, '0')}`).join(' ');
      console.debug(`[Debug] write: ${hex}`);
    } catch (err) {
      console.error(`[Error] write: ${err}`);
    }
  }

  async writeLine(data: string): Promise<void> {
    await this.write(`${data}\r\n`);
  }
}
