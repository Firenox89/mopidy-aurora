import * as React from 'react';
import {Link} from "react-router-dom";
import Mopidy from '../mopidy/MopidyHelper';
import './TrackListItem.css';

interface ITrackListItemProps {
  mopidy: Mopidy
  type: string
  title: string
  uri: string
  artists: string
  length: string
  coverUri: string
  playCallback: (uri: string) => void
}

export default class TrackListItem extends React.Component<ITrackListItemProps, {}> {
  constructor(props: any) {
    super(props);

    this.state = {
      artists: "",
      coverUri: "",
      length: "",
    };

    this.playTrack = this.playTrack.bind(this);
  }

  public render() {
    return (
        <div className="track">
          {this.props.type === "track" ?
              <div className="trackInfoContainer" onClick={this.playTrack}>
                <div className="cover">
                  <img src={this.props.coverUri} className='cover'/>
                </div>
                <div className="trackInfo">
                  <div className="trackArtist">{this.props.artists}</div>
                  <div className="trackTitle">{this.props.title}</div>
                  <div className="trackLength">{this.props.length}</div>
                </div>
              </div>
              :
              <Link className="directory" to={"/aurora/" + encodeURIComponent(this.props.uri)}>{this.props.title}</Link>
          }
        </div>
    );
  }

  private playTrack() {
    this.props.playCallback(this.props.uri)
  }
}