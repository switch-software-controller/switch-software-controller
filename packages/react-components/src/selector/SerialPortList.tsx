import React, { type ForwardedRef, forwardRef } from "react";
import { type SerialPort, SerialPortOption } from "./SerialPortOption.tsx";

export type SerialPortListProps = {
  ports: SerialPort[];
  onClick: (id: string) => void;
};

export const SerialPortList = forwardRef(function SerialPortList({ ports, onClick }: SerialPortListProps, ref: ForwardedRef<HTMLUListElement>) {
  return (
    <ul ref={ref} className="flex max-w-48 flex-col gap-1 rounded-md border border-on-primary-container bg-primary-container p-2">
      {ports.map((port, index) => (
        <>
          <li key={port.id} className="flex flex-col gap-1">
            <SerialPortOption port={port} onClick={onClick} />
            {index < ports.length - 1 && (
              <hr className="max-h-max border-on-primary-container" />
            )}
          </li>
        </>
      ))}
    </ul>
  );
});
