import * as React from 'react';
import Mopidy from '../Mopidy';
import TrackListItem from "./TrackListItem";
import './Tracks.css';

interface ITracksProps {
  mopidy: Mopidy
  uri: string
}

interface ITracksState {
  tracks: IBrowseResult[]
  tlTracks?: ITlTrack[]
}

interface IBrowseResult {
  type: string
  name: string
  uri: string
}

interface IAlbum {
  images: string[]
  name: string
}

interface IArtist {
  name: string
}

interface ITrack {
  album: IAlbum
  artists: IArtist[]
  comment: string
  length: number
  name: string
  uri: string
}

export interface ITlTrack {
  tlid: number
  track: ITrack
}

export default class Tracks extends React.Component<ITracksProps, ITracksState> {
  constructor(props: any) {
    super(props);

    this.state = {
      tracks: [],
    };

    this.loadAudioSources = this.loadAudioSources.bind(this);
    this.loadAudioSources(this.props.uri);

    this.props.mopidy.getTlTracks().then((result: ITlTrack[]) =>{
      this.setState({tlTracks: result});
      console.log("TlTracks loadd");
      console.log(result);
    })
  }

  public render() {
    const tracks: JSX.Element[] = [];
    this.state.tracks.forEach((item: IBrowseResult, index: number) => {
      tracks.push(
          <TrackListItem key={item.uri} mopidy={this.props.mopidy} tlTracks={this.state.tlTracks} type={item.type} uri={item.uri} name={item.name}/>
      );
    });
    return (
        <div className="tracks">
          {tracks}
        </div>
    );
  }

  public componentWillReceiveProps(nextProps: ITracksProps) {
    this.loadAudioSources(nextProps.uri)
  }

  private loadAudioSources(uri: string) {
    this.props.mopidy.browse(uri).then((results: IBrowseResult[]) => {
      this.setState({
        tracks: results
      });
    })
  }
}
