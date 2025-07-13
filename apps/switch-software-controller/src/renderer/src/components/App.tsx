import path from 'node:path';
import { app } from '@electron/remote';
import { useCamera } from '@renderer/hooks';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

const dataDir = path.join(app.getPath('userData'), 'ssc-data');

function App(): React.JSX.Element {
  const videoElementId = 'camera';
  const video = useMemo(
    () => document.getElementById(videoElementId) as HTMLVideoElement,
    [],
  );

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const { takeScreenshot, currentDevice, setCurrentDevice } = useCamera(video);
  const resetDevices = useCallback(() => {
    navigator.mediaDevices.enumerateDevices().then((mediaDevices) => {
      const videoInputs = mediaDevices.filter(
        (device) => device.kind === 'videoinput',
      );
      setDevices(videoInputs);
      if (videoInputs.length > 0) {
        setCurrentDevice(videoInputs[0]);
      }
    });
  }, [setDevices, setCurrentDevice]);

  useEffect(() => {
    resetDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <select
        value={currentDevice?.deviceId}
        onChange={(event) => {
          const deviceId = event.target.value;
          const device = devices.find((device) => device.deviceId === deviceId);
          if (device) {
            setCurrentDevice(device);
          }
        }}
      >
        {devices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Device ${device.deviceId}`}
          </option>
        ))}
      </select>
      <button
        onClick={() =>
          takeScreenshot(path.join(dataDir, 'captures', 'screenshot.png'))
        }
      >
        Take Screenshot
      </button>
      <video id={videoElementId} autoPlay={true} className="max-w-full" />
      <div>{path.join(dataDir, 'captures', 'screenshot.png')}</div>
    </div>
  );
}

export default App;
