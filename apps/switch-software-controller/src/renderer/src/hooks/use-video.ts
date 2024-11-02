import { useCallback, useMemo, useState } from 'react';
import fs from 'node:fs';

export class VideoTrack {
  private settings: MediaTrackSettings;

  constructor(public track: MediaStreamTrack) {
    this.settings = track.getSettings();
  }

  get width(): number {
    return this.settings.width ?? 0;
  }

  get height(): number {
    return this.settings.height ?? 0;
  }
}

export function useVideo(videoElement: HTMLVideoElement) {
  const video = useMemo<HTMLVideoElement>(() => videoElement, [videoElement]);
  const [videoInputDevices, setVideoInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideoInputDevice, setSelectedVideoInputDevice] = useState<MediaDeviceInfo | null>(null);
  const [playingVideoTrack, setPlayingVideoTrack] = useState<VideoTrack | null>(null);

  const selectVideoInputDevice = useCallback((id: string) => {
    const selected = videoInputDevices.find((device) => device.deviceId === id);
    if (selected) {
      setSelectedVideoInputDevice(selected);
    }
  }, [videoInputDevices]);

  const playVideo = useCallback(() => {
    if (video && selectedVideoInputDevice) {
      navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: selectedVideoInputDevice.deviceId,
        }
      })
        .then((stream) => {
          const track = stream.getVideoTracks()[0];
          setPlayingVideoTrack(new VideoTrack(track));
          video.srcObject = stream;
        });
    }
  }, [selectedVideoInputDevice, video]);

  const canvas = useMemo(() => {
    const canvas = document.createElement('canvas');
    if (playingVideoTrack) {
      canvas.width = playingVideoTrack.width;
      canvas.height = playingVideoTrack.height;
    }
    return canvas;
  }, [playingVideoTrack]);
  const context = useMemo(() => canvas.getContext('2d'), [canvas]);

  const takeScreenshot = useCallback((path: string) => {
    if (playingVideoTrack && context) {
      context.drawImage(video, 0, 0, playingVideoTrack.width, playingVideoTrack.height);
      canvas.toBlob((blob) => {
        if (blob) {
          blob.arrayBuffer().then((buffer) => {
            fs.writeFileSync(path, new Uint8Array(buffer))
          });
        }
      }, 'image/png', 1.0);
    }
  }, [context, playingVideoTrack, canvas.toBlob, video]);

  return {
    videoInputDevices,
    setVideoInputDevices,
    selectVideoInputDevice,
    playVideo,
    takeScreenshot,
  };
}
