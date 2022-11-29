import TrackPlayer from './TrackPlayer';

export default class Player extends TrackPlayer {
  /* For singleton */
  private static _instance: Player | null = null;

  static getInstance(): Player {
    if (Player._instance == null) {
      Player._instance = new Player();
    }
    (window as any).player = this;
    return this._instance!;
  }

  /* player */
  private tracks!: TrackInfo[];
  private currentTrack?: TrackInfo;
  private index = 0;

  onTrackChanged?: (track: TrackInfo) => void;

  private constructor(tracks?: TrackInfo[]) {
    super();
    this.setTracks(tracks ?? []);
  }

  public get getIndex(): number {
    return this.index;
  }

  setIndex(idx: number) {
    if (idx < this.tracks.length) {
      this.index = idx;
      this.setTrack(this.tracks[idx]);
      this.play();
      this.currentTrack = this.tracks[idx];
      this.onTrackChanged?.(this.tracks[idx]);
    } else {
      throw Error(
        `Out of index of tracks idx: ${idx}, length: ${this.tracks.length}`,
      );
    }
  }

  setTracks(tracks: TrackInfo[]) {
    if (tracks && tracks.length > 0) {
      this.tracks = [...tracks];
      this.setIndex(0);
    } else {
      this.tracks = [];
    }
  }
  getTracks() {
    return this.tracks;
  }

  putTrack(track: TrackInfo) {
    const newTracks = this.tracks.map(t => {
      if (t.combinationId === track.combinationId) {
        return track;
      }
      return t;
    });
    this.tracks = [...newTracks];
  }

  getTrack() {
    return this.currentTrack;
  }

  addTrack(track: TrackInfo) {
    this.tracks.splice(this.index, 0, { ...track });
    this.setIndex(this.index);
  }

  playNext() {
    if (this.index + 1 < this.tracks.length) {
      this.setIndex(this.index + 1);
    }
  }

  playPrev() {
    if (this.index - 1 >= 0) {
      this.setIndex(this.index - 1);
    }
  }
}
