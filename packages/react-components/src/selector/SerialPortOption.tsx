import React from "react";

export type SerialPort = {
  id: string;
  name: string;
  path: string;
};

export type SerialPortOptionProps = {
  port: SerialPort;
  onClick: (id: string) => void;
};

export function SerialPortOption({ port, onClick }: SerialPortOptionProps) {
  return (
    <div
      className="flex max-w-48 flex-col rounded-md bg-primary-container p-4 transition-colors duration-hover ease-in hover:bg-primary-container-hover"
      onClick={() => onClick(port.id)}
    >
      <div className="font-bold text-lg text-on-primary-container">
        {port.name}
      </div>
      <div className="flex gap-2 text-on-primary-container text-sm brightness-75">
        <div>path:</div>
        <div>{port.path}</div>
      </div>
    </div>
  );
}
