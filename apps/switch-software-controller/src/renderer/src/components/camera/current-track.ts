export class CurrentTrack {
  private settings: MediaTrackSettings;

  constructor(public track: MediaStreamTrack) {
    this.settings = this.track.getSettings();
  }

  get width() {
    return this.settings.width ?? 0;
  }

  get height() {
    return this.settings.height ?? 0;
  }
}
