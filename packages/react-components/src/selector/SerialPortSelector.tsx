import React from "react";
import { type SerialPort, SerialPortOption } from "./SerialPortOption.tsx";

export type SerialPortSelectProps = {
  ports: SerialPort[];
  onClick: (id: string) => void;
};

export function SerialPortSelect({ ports, onClick }: SerialPortSelectProps) {
  return (
    <div className="flex max-w-48 flex-col gap-1 rounded-md bg-primary-container p-2">
      {ports.map((port, index) => (
        <>
          <div key={port.id}>
            <SerialPortOption port={port} onClick={onClick} />
          </div>
          {index < ports.length - 1 && (
            <hr className="max-h-max border-on-primary-container" />
          )}
        </>
      ))}
    </div>
  );
}
