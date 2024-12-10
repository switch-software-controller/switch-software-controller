export type SerialPortOpenOptions = {
  baudRate: number;
};

export interface SerialPort {
  /**
   * Opens the serial port.
   * @param options The options for open the serial port.
   */
  open(options: SerialPortOpenOptions): Promise<void>;

  /**
   * Closes the serial port.
   */
  close(): Promise<void>;

  /**
   * Writes data to the serial port.
   * @param data
   */
  write(data: string): Promise<void>;

  /**
   * Writes a line to the serial port.
   * @param data
   */
  writeLine(data: string): Promise<void>;
}
