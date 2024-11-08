import type { SerialPort as Base, SerialPortOpenOptions, } from '@switch-software-controller/serial-port-api';

export class SerialPortImpl implements Base {
  private readonly encoder = new TextEncoder();
  private _writer: WritableStreamDefaultWriter<Uint8Array> | null = null;

  constructor(private readonly port: SerialPort) {}

  private get writer(): WritableStreamDefaultWriter<Uint8Array> {
    if (!this._writer) {
      this._writer = this.port.writable.getWriter();
    }
    return this._writer;
  }

  open(options: SerialPortOpenOptions): void {
    this.port.open(options).catch((err) => console.log(err));
  }

  close(): void {
    try {
      if (this._writer) {
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
