import type { SerialPortInfo } from "./info.ts";

export interface SerialPort {
  /**
   * Opens the serial port.
   * @param info The information of the serial port.
   */
  open(info: SerialPortInfo): void;

  /**
   * Closes the serial port.
   */
  close(): void;

  /**
   * Writes data to the serial port.
   * @param data
   */
  write(data: string): void;

  /**
   * Writes a line to the serial port.
   * @param data
   */
  writeLine(data: string): void;
}
