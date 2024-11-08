import type { SerialPort as Base, SerialPortOpenOptions, } from '@switch-software-controller/serial-port-api';

export interface Encoder {
  encode(data: string): Uint8Array;
}

export class SerialPortImpl implements Base {
  private writer_: WritableStreamDefaultWriter<Uint8Array> | null = null;
  private readonly port: SerialPort;
  private readonly encoder: Encoder;

  constructor(
    port: SerialPort,
    encoder: Encoder,
  ) {
    this.port = port;
    this.encoder = encoder;
  }

  private get writer(): WritableStreamDefaultWriter<Uint8Array> {
    if (!this.writer_) {
      this.writer_ = this.port.writable.getWriter();
    }
    return this.writer_;
  }

  open(options: SerialPortOpenOptions): void {
    this.port.open(options).catch((err) => console.log(err));
  }

  close(): void {
    try {
      if (this.writer_) {
        this.writer.releaseLock();
      }
    } catch (e) {
      console.log(e);
    }
    this.port.close().catch((err) => console.log(err));
  }

  write(data: string): void {
    const encoded = this.encoder.encode(data);
    // const hex = Array.from(encoded).map((n) => `0x${n.toString(16).padStart(2, '0')}`).join(' ');
    this.writer
      .write(encoded)
      .then(() => {})
      .catch((err) => console.log(err));
  }

  writeLine(data: string): void {
    this.write(`${data}\r\n`);
  }
}
