import path from 'node:path';
import { app } from '@electron/remote';
import { useVideo } from '@renderer/hooks/use-video';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { BsController } from 'react-icons/bs';
import { CiVideoOn } from 'react-icons/ci';
import { FaUsb } from 'react-icons/fa';

const dataDir = path.join(app.getPath('userData'), 'ssc-data');

async function getVideoInputDevices() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter((device) => device.kind === 'videoinput');
}

function App(): React.JSX.Element {
  const videoElementId = 'camera';
  const videoElement = document.getElementById(
    videoElementId,
  ) as HTMLVideoElement;
  const [serialPorts, setSerialPorts] = useState<SerialPort[]>([]);
  const [selectedPort, setSelectedPort] = useState<SerialPort | null>(
    null,
  );
  const [port, setPort] = useState<SerialPort>(null);

  const {
    videoInputDevices,
    setVideoInputDevices,
    selectVideoInputDevice,
    playVideo,
    takeScreenshot,
  } = useVideo(videoElement);

  useEffect(() => {
    getVideoInputDevices().then((devices) => {
      setVideoInputDevices(devices);
    });
  }, [setVideoInputDevices]);

  useEffect(() => {
    if (videoInputDevices.length > 0) {
      selectVideoInputDevice(videoInputDevices[0].deviceId);
    }
  }, [videoInputDevices, selectVideoInputDevice]);

  const listPorts = useCallback(() => {
    navigator.serial.getPorts().then((ports) => {
      setSerialPorts(ports.filter((port) => port.connected));
    });
  }, []);

  const listUsbDevices = useCallback(() => {
    navigator.usb.getDevices().then((devices) => {
      console.log(devices);
    });
  }, []);

  return (
    <div className="h-dvh bg-surface">
      <div className="flex h-dvh">
        <div className="flex flex-1 flex-col text-on-surface">
          <video id={videoElementId} className="w-full p-2" autoPlay />
          <div className="flex h-full w-full">
            <div className="flex flex-1 flex-col gap-4 p-2">
              <div className="flex gap-2">
                <CiVideoOn />
                <select
                  className="flex-1 bg-surface-dim"
                  onChange={(event) =>
                    selectVideoInputDevice(event.target.value)
                  }
                >
                  {videoInputDevices.map((device) => {
                    return (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label}
                      </option>
                    );
                  })}
                </select>
                <button
                  className="rounded-md bg-primary px-2 text-on-primary"
                  onClick={playVideo}
                >
                  Connect
                </button>
              </div>
              <div className="flex gap-2">
                <FaUsb />
                <select
                  className="flex-1 bg-surface-dim"
                  onChange={(e) => {
                    setSelectedPort(
                      serialPorts.find((port) => {
                        const info = port.getInfo();
                        return `0x${info.usbVendorId.toString(16).padStart(4, '0')} | 0x${info.usbProductId.toString(16).padStart(4, '0')}` === e.target.value;
                      }),
                    );
                  }}
                >
                  {serialPorts.map((port) => {
                    const info = port.getInfo();
                    const s = `0x${info.usbVendorId.toString(16).padStart(4, '0')} | 0x${info.usbProductId.toString(16).padStart(4, '0')}`;
                    return (
                      <option key={s} value={s}>{s}</option>
                    );
                  })}
                </select>
                <button
                  className="rounded-md bg-primary px-2 text-on-primary"
                  onClick={() => {
                    if (selectedPort) {
                      const info = selectedPort.getInfo();
                      const usbVendorId = info.usbVendorId;
                      const usbProductId = info.usbProductId;
                      console.log(usbVendorId);
                      console.log(usbProductId);
                      navigator.serial
                        .requestPort({
                          filters: [{ usbVendorId, usbProductId }],
                        })
                        .then((port) => {
                          setPort(port);
                          port.open({ baudRate: 9600 });
                        });
                    }
                  }}
                >
                  Connect
                </button>
              </div>
              <div className="flex gap-2">
                <BsController />
                <select className="flex-1 bg-surface-dim">
                  <option>Controller1</option>
                  <option>Controller2</option>
                  <option>Controller3</option>
                </select>
                <button className="rounded-md bg-primary px-2 text-on-primary">
                  Connect
                </button>
              </div>
            </div>
            <div className="flex flex-1 p-2">
              Macro
              <button
                onClick={() =>
                  takeScreenshot(
                    path.join(dataDir, 'captures', 'screenshot.png'),
                  )
                }
              >
                Screenshot
              </button>
              <button onClick={() => listPorts()}>Update Ports</button>
              <button onClick={() => listUsbDevices()}>Update USB</button>
            </div>
          </div>
        </div>
        <div
          className="flex h-full w-80 flex-col overflow-y-scroll border border-on-surface bg-surface-bright p-2 text-on-surface">
          Timeline
        </div>
      </div>
    </div>
  );
}

export default App;
