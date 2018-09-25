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
    this.mopidy.call("core.mixer.set_volume", {volume: 15})
  }

  getState() {
    return this.mopidy.call("core.playback.get_state")
  }

  getRandom() {
    return this.mopidy.call("core.playback.get_state")
  }

  getTimePosition() {
    return this.mopidy.call("core.playback.get_time_position")
  }

  seek(time: number) {
    this.mopidy.call("core.playback.seek", {"time_position": time})
  }
}
