import * as fs from 'node:fs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MediaTrack } from './media-track';

export function useCamera(
  videoElement: HTMLVideoElement,
  initialDeviceInfo?: MediaDeviceInfo,
) {
  const [currentDevice, setCurrentDevice] =
    useState<MediaDeviceInfo>(initialDeviceInfo);
  const [currentTrack, setCurrentTrack] = useState<MediaTrack>();

  const canvas = useMemo(() => {
    const canvas = document.createElement('canvas');
    if (currentTrack) {
      canvas.width = currentTrack.width;
      canvas.height = currentTrack.height;
    }
    return canvas;
  }, [currentTrack]);
  const context = useMemo(() => canvas.getContext('2d'), [canvas]);

  const takeScreenshot = useCallback(
    (savePath: string) => {
      if (currentTrack) {
        context.drawImage(
          videoElement,
          0,
          0,
          currentTrack.width,
          currentTrack.height,
        );
        canvas.toBlob(
          (blob) => {
            blob.arrayBuffer().then((buffer) => {
              fs.writeFileSync(savePath, new Uint8Array(buffer));
            });
          },
          'image/png',
          1.0,
        );
      }
    },
    [context, currentTrack],
  );

  useEffect(() => {
    if (currentDevice && videoElement) {
      navigator.mediaDevices
        .getUserMedia({
          video: { deviceId: currentDevice.deviceId },
        })
        .then((stream) => {
          const track = stream.getVideoTracks()[0];
          setCurrentTrack(new MediaTrack(track));
          videoElement.srcObject = stream;
        });
    }

    return () => {
      if (videoElement?.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoElement.srcObject = null;
      }
    };
  }, [currentDevice, videoElement]);

  return {
    currentDevice,
    setCurrentDevice,
    takeScreenshot,
  };
}
