import MopidyClient from "./MopidyClient";

export default class Mopidy {

  private mopidy = new MopidyClient('ws://192.168.2.118/mopidy/ws/');

  play() {
    this.mopidy.call("core.playback.play", {})
  }

  pause() {
    this.mopidy.call("core.playback.pause", {})
  }

  previous() {
    this.mopidy.call("core.playback.previous", {})
  }

  skip() {
    this.mopidy.call("core.playback.next", {})
  }

  getTrack() {
    return this.mopidy.call("core.playback.get_current_track")
  }

  getVolume() {
    return this.mopidy.call("core.mixer.get_volume")
  }

  setVolume(volume: number) {
    this.mopidy.call("core.mixer.set_volume", {volume})
  }

  onVolume(handler: Function) {
    this.mopidy.on('event:volumeChanged', handler)
  }

  getState() {
    return this.mopidy.call("core.playback.get_state")
  }

  getRandom() {
    return this.mopidy.call("core.playback.get_state")
  }

  seek(time: number) {
    this.mopidy.call("core.playback.seek", {"time_position": time})
  }

  getPosition() {
    return this.mopidy.call("core.playback.get_time_position")
  }

  onTrackPlaybackStarted(handler: Function) {
    this.mopidy.on('event:trackPlaybackStarted', handler)
  }

  loadAudioSources() {
    return this.mopidy.call("core.library.browse", {"uri": null})
  }

  browse(uri: string) {
    return this.mopidy.call("core.library.browse", {"uri": uri})
  }
}
