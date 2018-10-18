import * as React from 'react';
import Mopidy from '../mopidy/Mopidy';
import {ITlTrack, ITrack} from "../mopidy/MopidyInterfaces";
import Utils from "../Utils";
import TrackListItem from "./TrackListItem";
import './Tracks.css';

interface ITracksProps {
  mopidy: Mopidy
  uri: string
}

interface ITracksState {
  trackList: ITrack[]
  trackListElements: JSX.Element[]
}

interface IBrowseResult {
  type: string
  name: string
  uri: string
}

export default class Tracks extends React.Component<ITracksProps, ITracksState> {
  constructor(props: any) {
    super(props);

    this.state = {
      trackList: [],
      trackListElements: [],
    };

    this.loadAudioSources = this.loadAudioSources.bind(this);
    this.playTrack = this.playTrack.bind(this);
    this.loadAudioSources(this.props.uri);
  }

  public render() {
    return (
        <div className="tracks">
          {this.state.trackListElements}
        </div>
    );
  }

  public componentWillReceiveProps(nextProps: ITracksProps) {
    this.loadAudioSources(nextProps.uri)
  }

  private loadAudioSources(uri: string) {
    this.props.mopidy.browse(uri).then((browseResult: IBrowseResult[]) => {
      const trackListElements: JSX.Element[] = [];
      const trackList: ITrack[] = [];
      browseResult.filter((item: IBrowseResult) => item.type === "directory").forEach((item: IBrowseResult, index: number) => {
        const artists = '';
        const coverUri = '';
        const length = '';
        trackListElements.push(
            <TrackListItem key={item.uri}
                           mopidy={this.props.mopidy}
                           type={item.type}
                           title={item.name}
                           uri={item.uri}
                           artists={artists}
                           length={length}
                           coverUri={coverUri}
                           playCallback={this.playTrack}/>
        );
      });
      let trackUris = browseResult.filter((item: IBrowseResult) => item.type === "track").map((item: IBrowseResult) => item.uri);
      if (trackUris.length > 30) { // TODO paging
        trackUris = trackUris.slice(0, 30);
      }
      if (trackUris.length > 0) {
        this.props.mopidy.lookupTracks(trackUris).then((iTracks: ITrack[]) => {
          trackUris.map((trackUri: string) => iTracks[trackUri][0]).forEach((track: ITrack) => {
            if (track !== undefined) {
              trackList.push(track);
              let artists = '';
              let coverUri = '';
              if (track.album !== undefined && track.album.images !== undefined && track.album.images.length > 0) {
                coverUri = track.album.images[0];
              }
              if (track.artists !== undefined) {
                track.artists.forEach((artist: any) => artists = artists + ' ' + artist.name);
              }
              const length = Utils.timestampToReadableString(track.length);
              trackListElements.push(
                  <TrackListItem key={track.uri}
                                 mopidy={this.props.mopidy}
                                 type="track"
                                 title={track.name}
                                 uri={track.uri}
                                 artists={artists}
                                 length={length}
                                 coverUri={coverUri}
                                 playCallback={this.playTrack}/>
              );
            }
          });
          this.setState({
            trackList,
            trackListElements,
          });
        });
      } else {
        this.setState({
          trackList,
          trackListElements,
        });
      }
    })
  }

  private playTrack(uri: string) {
    const mopidy = this.props.mopidy;
    mopidy.stop();
    mopidy.clearTracklist();
    mopidy.addToTracklist(this.state.trackList);
    mopidy.getTlTracks().then((tlTracks: ITlTrack[]) => {
      const foundTlTrack = tlTracks.find((tlTrack: ITlTrack) => tlTrack.track.uri === uri);
      if (foundTlTrack !== undefined) {
        mopidy.playTrack(foundTlTrack.tlid)
      }
    })
  }
}
