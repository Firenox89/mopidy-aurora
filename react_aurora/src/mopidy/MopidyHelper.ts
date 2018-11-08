import * as Mopidy from 'mopidy';
import {ITrack} from "./MopidyInterfaces";

export default class MopidyHelper {

  public isOnline = false;
  private mopidy = Mopidy({
    callingConvention: 'by-position-or-by-name',
    webSocketUrl: 'ws://' + window.location.host + '/mopidy/ws/',
  });

  constructor() {
    // this.mopidy.on(console.log.bind(console));
    this.mopidy.errback((error: any) => {
      console.log(error);
    });

    const self = this;
    this.mopidy.on("state:online", () => {
      self.isOnline = true;
    });
    this.mopidy.on("state:offline", () => {
      self.isOnline = false;
    });
  }

  public onOnline(handler: () => void) {
    this.mopidy.on("state:online", () => {
      handler();
    });
  }

  public play() {
    this.mopidy.playback.play()
  }

  public pause() {
    this.mopidy.playback.pause()
  }

  public stop() {
    this.mopidy.playback.stop()
  }

  public previous() {
    this.mopidy.playback.previous()
  }

  public skip() {
    this.mopidy.playback.next()
  }

  public getTrack() {
    return this.mopidy.playback.getCurrentTrack()
  }

  public getVolume() {
    return this.mopidy.mixer.getVolume()
  }

  public setVolume(volume: number) {
    return this.mopidy.mixer.setVolume({"volume": volume})
  }

  public onVolume(handler: (event: any) => void) {
    this.mopidy.on('event:volumeChanged', handler)
  }

  public getState() {
    return this.mopidy.playback.getState()
  }

  public getRandom() {
    return this.mopidy.playback.getRandom()
  }

  public seek(time: number) {
    this.mopidy.playback.seek({"time_position": time})
  }

  public getPosition() {
    return this.mopidy.playback.getTimePosition()
  }

  public onTrackPlaybackStarted(handler: (event: any) => void) {
    this.mopidy.on('event:trackPlaybackStarted', handler)
  }

  public loadAudioSources() {
    return this.mopidy.library.browse( {"uri": null} )
  }

  public browse(uri: string) {
    return this.mopidy.library.browse({"uri": uri})
  }

  public playTrack(id: number) {
    this.mopidy.playback.play({"tlid": id})
  }

  public lookup(uri: string) {
    return this.mopidy.library.lookup({"uri": uri})
  }

  public getPlaylists() {
    return this.mopidy.playlists.getPlaylists()
  }

  public getTlTracks() {
    return this.mopidy.tracklist.getTlTracks()
  }

  public addToTracklist(tracks: ITrack[]) {
    return this.mopidy.tracklist.add({"tracks": tracks})
  }

  public clearTracklist() {
    return this.mopidy.tracklist.clear()
  }

  public lookupTracks(trackUris: string[]) {
    return this.mopidy.library.lookup({"uris": trackUris})
  }

  public getImages(trackUris: string[]) {
    return this.mopidy.library.getImages({"uris": trackUris})
  }

  public togglePlay() {
    this.mopidy.playback.getState().then((state: string) => {
      if (state === "playing") {
        this.pause()
      } else {
        this.play()
      }
    })
  }
}
