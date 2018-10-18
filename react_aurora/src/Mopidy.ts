import MopidyClient from "./MopidyClient";

export default class Mopidy {

  private mopidy = new MopidyClient('ws://192.168.2.118/mopidy/ws/');

  public play() {
    this.mopidy.call("core.playback.play", {})
  }

  public pause() {
    this.mopidy.call("core.playback.pause", {})
  }

  public previous() {
    this.mopidy.call("core.playback.previous", {})
  }

  public skip() {
    this.mopidy.call("core.playback.next", {})
  }

  public getTrack() {
    return this.mopidy.call("core.playback.get_current_track")
  }

  public getVolume() {
    return this.mopidy.call("core.mixer.get_volume")
  }

  public setVolume(volume: number) {
    this.mopidy.call("core.mixer.set_volume", {volume})
  }

  public onVolume(handler: Function) {
    this.mopidy.on('event:volumeChanged', handler)
  }

  public getState() {
    return this.mopidy.call("core.playback.get_state")
  }

  public getRandom() {
    return this.mopidy.call("core.playback.get_state")
  }

  public seek(time: number) {
    this.mopidy.call("core.playback.seek", {"time_position": time})
  }

  public getPosition() {
    return this.mopidy.call("core.playback.get_time_position")
  }

  public onTrackPlaybackStarted(handler: Function) {
    this.mopidy.on('event:trackPlaybackStarted', handler)
  }

  public loadAudioSources() {
    return this.mopidy.call("core.library.browse", {"uri": null})
  }

  public browse(uri: string) {
    return this.mopidy.call("core.library.browse", {"uri": uri})
  }

  public playTrack(id: number) {
    this.mopidy.call("core.playback.play", {"tlid": id})
  }

  public lookup(uri: string) {
    return this.mopidy.call("core.library.lookup", {"uri": uri})
  }

  public getPlaylists() {
    return this.mopidy.call("core.playlists.get_playlists")
  }

  public getTlTracks() {
    return this.mopidy.call("core.tracklist.get_tl_tracks")
  }
}
