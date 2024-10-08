import * as path from "node:path";
import { app } from "@electron/remote";
import React, { useEffect } from "react";
import { useCamera } from "./use-camera";

const dataDir = path.join(app.getPath("userData"), "ssc-data");

async function getVideoInputDevices(): Promise<MediaDeviceInfo[]> {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter((device) => device.kind === "videoinput");
}

export function Camera() {
  const videoElementId = "camera";
  const camera = document.getElementById(videoElementId) as HTMLVideoElement;

  const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([]);
  const {
    takeScreenshot,
    device: selectedDevice,
    setDevice: setSelectedDevice,
  } = useCamera(camera, null);

  useEffect(() => {
    getVideoInputDevices().then((devices) => {
      setDevices(devices);
      if (devices.length > 0) {
        setSelectedDevice(devices[0]);
      }
    });
  }, [setSelectedDevice]);

  return (
    <div>
      <select
        value={selectedDevice?.deviceId}
        onChange={(event) => {
          const deviceId = event.target.value;
          const device = devices.find((device) => device.deviceId === deviceId);
          if (device) {
            setSelectedDevice(device);
          }
        }}
      >
        {devices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() =>
          takeScreenshot(path.join(dataDir, "captures", "screenshot.png"))
        }
      >
        Take Screenshot
      </button>
      {/* biome-ignore lint/a11y/useMediaCaption: */}
      <video id={videoElementId} autoPlay={true} style={{ maxWidth: "100%" }} />
    </div>
  );
}
