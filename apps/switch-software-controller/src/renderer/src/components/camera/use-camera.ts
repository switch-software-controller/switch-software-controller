import * as fs from "node:fs";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CurrentTrack } from "./current-track";

export function useCamera(
  videoElement: HTMLVideoElement,
  initialDeviceInfo: MediaDeviceInfo | null,
) {
  const [device, setDevice] = React.useState<MediaDeviceInfo | null>(
    initialDeviceInfo,
  );
  const [currentTrack, setCurrentTrack] = useState<CurrentTrack | null>(null);

  const canvas = useMemo(() => {
    const canvas = document.createElement("canvas");
    if (currentTrack) {
      canvas.width = currentTrack.width;
      canvas.height = currentTrack.height;
    }
    return canvas;
  }, [currentTrack]);
  const context = useMemo(() => canvas.getContext("2d"), [canvas]);

  const takeScreenshot = useCallback(
    (savePath: string) => {
      if (currentTrack && context) {
        context.drawImage(
          videoElement,
          0,
          0,
          currentTrack.width,
          currentTrack.height,
        );
        canvas.toBlob(
          (blob) => {
            if (blob) {
              blob.arrayBuffer().then((buffer) => {
                fs.writeFileSync(savePath, new Uint8Array(buffer));
              });
            }
          },
          "image/png",
          1.0,
        );
      }
    },
    [context, currentTrack, canvas.toBlob, videoElement],
  );

  useEffect(() => {
    if (device) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            deviceId: device.deviceId,
          },
        })
        .then((stream) => {
          const track = stream.getVideoTracks()[0];
          setCurrentTrack(new CurrentTrack(track));
          videoElement.srcObject = stream;
        });
    }
  }, [device, videoElement]);

  return {
    device,
    setDevice,
    takeScreenshot,
  };
}
