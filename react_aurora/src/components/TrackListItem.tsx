import * as React from 'react';
import {Link} from "react-router-dom";
import Mopidy from '../Mopidy';
import './TrackListItem.css';
import {ITlTrack} from './Tracks';
import Utils from "../Utils";

interface ITrackListItemProps {
  mopidy: Mopidy
  tlTracks?: ITlTrack[]
  type: string
  name: string
  uri: string
}

interface ITrackListItemState {
  tlTracks?: ITlTrack[]
  artists: string
  length: string
  coverUri: string
  tlid: number
}


export default class TrackListItem extends React.Component<ITrackListItemProps, ITrackListItemState> {
  constructor(props: any) {
    super(props);

    this.state = {
      artists: "",
      coverUri: "",
      length: "",
      tlid: -1,
    };

    this.playTrack = this.playTrack.bind(this);
  }

  public render() {
    return (
        <div className="track">
          {this.props.type === "track" ?
              <div className="trackInfoContainer" onClick={this.playTrack}>
                <div className="cover">
                  <img src={this.state.coverUri} className='cover'/>
                </div>
                <div className="trackInfo">
                  <div className="trackInfoText">{this.state.artists}</div>
                  <div className="trackInfoText">{this.props.name}</div>
                  <div className="trackInfoText">{this.state.length}</div>
                </div>
              </div>
              :
              <Link className="directory" to={"/" + this.props.uri}>{this.props.name}</Link>
          }
        </div>
    );
  }

  public componentWillReceiveProps(nextProps: ITrackListItemProps) {
    if (nextProps.tlTracks !== undefined && this.props.type === "track") {
      const myTlTrack = nextProps.tlTracks.find((tlTrack: ITlTrack) => tlTrack.track.uri === this.props.uri);
      if (myTlTrack !== undefined) {
        let artists = '';
        let coverUri = '';
        myTlTrack.track.artists.forEach((artist: any) => artists = artists + ' ' + artist.name);
        if (myTlTrack.track.album.images[0]) {
          coverUri = myTlTrack.track.album.images[0]
        }
        this.setState({
          artists,
          coverUri,
          length: Utils.timestampToReadableString(myTlTrack.track.length),
          tlTracks: nextProps.tlTracks,
          tlid: myTlTrack.tlid
        })
      } else {
        console.log("Track not found " + this.props.name)
      }
    }
  }

  private playTrack() {
    if (this.state.tlid !== -1) {
      this.props.mopidy.playTrack(this.state.tlid)
    }
  }
}