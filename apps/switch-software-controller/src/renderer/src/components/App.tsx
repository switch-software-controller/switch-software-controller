import path from 'node:path';
import { app } from '@electron/remote';
import { useCamera } from '@renderer/hooks';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

/** Data directory path for storing application data */
const dataDir = path.join(app.getPath('userData'), 'ssc-data');

/**
 * Main App component that provides camera control interface
 * 
 * Features:
 * - Video device enumeration and selection
 * - Live camera preview
 * - Screenshot capture functionality
 * - Error handling and loading states
 * 
 * @returns React component for the main application interface
 */
function App(): React.JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { takeScreenshot, currentDevice, setCurrentDevice } = useCamera(
    videoRef.current,
  );
  /**
   * Enumerates and loads available video input devices
   * 
   * Sets the first available device as the current device if none is selected.
   * Handles loading states and error conditions during device enumeration.
   */
  const resetDevices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = mediaDevices.filter(
        (device) => device.kind === 'videoinput',
      );
      setDevices(videoInputs);
      if (videoInputs.length > 0) {
        setCurrentDevice(videoInputs[0]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to enumerate devices',
      );
    } finally {
      setIsLoading(false);
    }
  }, [setCurrentDevice]);

  useEffect(() => {
    resetDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {error && <div className="text-red-600">Error: {error}</div>}
      {isLoading && <div>Loading devices...</div>}
      <select
        value={currentDevice?.deviceId ?? ''}
        onChange={(event) => {
          const deviceId = event.target.value;
          const device = devices.find((device) => device.deviceId === deviceId);
          if (device) {
            setCurrentDevice(device);
          }
        }}
        disabled={isLoading}
      >
        <option value="">Select a camera</option>
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
        disabled={!currentDevice}
      >
        Take Screenshot
      </button>
      <video ref={videoRef} autoPlay={true} className="max-w-full" />
      <div>{path.join(dataDir, 'captures', 'screenshot.png')}</div>
    </div>
  );
}

export default App;
