import React, { useCallback, useRef } from "react";
import { useOnClickOutside } from "../hooks/use-on-click-outside.ts";
import { SerialPortList } from "./SerialPortList.tsx";
import type { SerialPort } from "./SerialPortOption.tsx";

export type SerialPortSelectorProps = {
  ports: SerialPort[];
  onClick: (id: string) => void;
};

export function SerialPortSelector({
  ports,
  onClick,
}: SerialPortSelectorProps) {
  const [visible, setVisible] = React.useState(false);
  const [currentPort, setCurrentPort] = React.useState<SerialPort | null>(
    ports?.[0] ?? null,
  );
  const ref = useRef<HTMLUListElement>(null);
  useOnClickOutside(ref, () => setVisible(false));
  const onSelect = useCallback(
    (id: string) => {
      onClick(id);
      setCurrentPort(ports.find((port) => port.id === id) ?? null);
      setVisible(false);
    },
    [onClick, ports.find],
  );

  return (
    <div className="flex flex-col">
      <button onClick={() => setVisible(!visible)}>{currentPort?.name}</button>
      {visible && <SerialPortList ref={ref} ports={ports} onClick={onSelect} />}
    </div>
  );
}
