export type SerialPortOpenOptions = {
  baudRate: number;
};

export interface SerialPort {
  /**
   * Opens the serial port.
   * @param options The options for open the serial port.
   */
  open(options: SerialPortOpenOptions): void;

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
