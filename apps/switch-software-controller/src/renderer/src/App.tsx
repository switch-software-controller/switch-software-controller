import path from 'node:path';
import { app } from '@electron/remote';
import { useController } from '@renderer/hooks/use-controller';
import { useGamepad, useGamepads } from '@renderer/hooks/use-gamepad';
import { useUsb } from '@renderer/hooks/use-usb';
import { useVideo } from '@renderer/hooks/use-video';
import type React from 'react';
import { useEffect } from 'react';
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

  const {
    videoInputDevices,
    setVideoInputDevices,
    selectVideoInputDevice,
    playVideo,
    takeScreenshot,
  } = useVideo(videoElement);

  const {
    usbDevices,
    updateUsbDevices,
    selectUsbDevice,
    connectUsbDevice,
    connectedUsbDevice,
  } = useUsb();

  const { controller } = useController(connectedUsbDevice);

  const { gamepads, updateGamepads, selectGamepad, selectedGamepad } =
    useGamepads();
  const { startUpdateGamepad } = useGamepad(controller, selectedGamepad?.id);

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

  useEffect(() => {
    updateUsbDevices().catch((err) => {
      console.error(`[Error] update usb devices: ${err}`);
    });
  }, [updateUsbDevices]);

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
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <FaUsb />
                  <select
                    className="flex-1 bg-surface-dim"
                    onChange={async (e) => {
                      selectUsbDevice(e.target.value);
                      await connectUsbDevice({ baudRate: 9600 });
                    }}
                  >
                    {usbDevices.map((device) => {
                      return (
                        <option
                          key={device.serialNumber}
                          value={device.serialNumber}
                        >
                          {device.productName}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <button
                  className="rounded-md bg-primary px-2 text-on-primary flex-1"
                  onClick={updateUsbDevices}
                >
                  Update USB Devices
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <BsController />
                  <select
                    className="flex-1 bg-surface-dim"
                    onChange={(e) => selectGamepad(e.target.value)}
                  >
                    {gamepads.map((gamepad) => {
                      return (
                        <option key={gamepad.id} value={gamepad.id}>
                          {gamepad.id}
                        </option>
                      );
                    })}
                  </select>
                  <button
                    className="rounded-md bg-primary px-2 text-on-primary"
                    onClick={startUpdateGamepad}
                  >
                    Connect
                  </button>
                </div>
                <button
                  className="rounded-md bg-primary px-2 text-on-primary flex-1"
                  onClick={updateGamepads}
                >
                  Update Gamepads
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
            </div>
          </div>
        </div>
        <div className="flex h-full w-80 flex-col overflow-y-scroll border border-on-surface bg-surface-bright p-2 text-on-surface">
          Timeline
        </div>
      </div>
    </div>
  );
}

export default App;
