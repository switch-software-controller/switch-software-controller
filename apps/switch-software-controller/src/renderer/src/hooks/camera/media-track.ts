/**
 * Wrapper class for MediaStreamTrack that provides convenient access to track dimensions
 *
 * Encapsulates a MediaStreamTrack and exposes its width and height properties
 * in a type-safe manner with fallback defaults.
 */
export class MediaTrack {
  /** Current track settings cached at construction time */
  private settings: MediaTrackSettings;

  /**
   * Creates a new MediaTrack wrapper
   *
   * @param track - The MediaStreamTrack to wrap
   */
  constructor(public track: MediaStreamTrack) {
    this.settings = track.getSettings();
  }

  /**
   * Gets the width of the media track
   *
   * @returns Track width in pixels, or 0 if not available
   */
  get width() {
    return this.settings.width ?? 0;
  }

  /**
   * Gets the height of the media track
   *
   * @returns Track height in pixels, or 0 if not available
   */
  get height() {
    return this.settings.height ?? 0;
  }
}
