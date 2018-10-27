import * as React from 'react';
import * as InfiniteScroll from 'react-infinite-scroller';
import ReactLoading from "react-loading";
import Mopidy from '../mopidy/MopidyHelper';
import {ITlTrack, ITrack} from "../mopidy/MopidyInterfaces";
import Utils from "../Utils";
import TrackListItem from "./TrackListItem";
import './Tracks.css';

const tracksPerPage = 10;

interface ITracksProps {
  mopidy: Mopidy
  uri: string
}

interface ITracksState {
  allDirUris: IBrowseResult[]
  allTrackUris: string[]
  allTracksLoaded: boolean
  currentPage: number
  isLoading: boolean
  loadedTracks: ITrack[]
  pages: IPage[]
}

interface IPage {
  id: number
  trackUris: string[]
  tracks: ITrack[]
  loaded: boolean
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
      allDirUris: [],
      allTrackUris: [],
      allTracksLoaded: false,
      currentPage: 0,
      isLoading: false,
      loadedTracks: [],
      pages: [],
    };

    this.renderTrackInfo = this.renderTrackInfo.bind(this);
    this.playTrack = this.playTrack.bind(this);
    this.loadNextPage = this.loadNextPage.bind(this);

    if (this.props.mopidy.isOnline) {
      this.loadAudioSources(this.props.uri);
    } else {
      this.props.mopidy.onOnline(() => {
        this.loadAudioSources(this.props.uri);
      })
    }
  }

  public render() {
    const pageContent: JSX.Element = <div>
      <div className="trackList" key="trackList">
        {this.renderDirs(this.state.allDirUris)}
        {this.renderTrackInfo(this.state.loadedTracks)}
      </div>
    </div>;
    return (
        <div className="tracks">
          <InfiniteScroll
              pageStart={-1}
              initialLoad={true}
              loadMore={this.loadNextPage}
              hasMore={!this.state.allTracksLoaded}
              loader={<div className="loadingContainer" key={0}><ReactLoading type="spin" color="#FFF"/></div>}
              useWindow={false}
          >
            {pageContent}
          </InfiniteScroll>
        </div>
    );
  }

  public componentWillReceiveProps(nextProps: ITracksProps) {
    this.loadAudioSources(nextProps.uri)
  }

  private renderTrackInfo(tracks: ITrack[]) {
    const trackListElements: JSX.Element[] = [];
    tracks.forEach((track: ITrack) => {
      if (track !== undefined) {
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
    return trackListElements
  }

  private renderDirs(dirs: IBrowseResult[]) {
    const trackListElements: JSX.Element[] = [];
    dirs.forEach((item: IBrowseResult, index: number) => {
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

    return trackListElements
  }

  private loadAudioSources(uri: string) {
    this.props.mopidy.browse(uri).then((browseResult: IBrowseResult[]) => {
      const dirs = browseResult.filter((item: IBrowseResult) => item.type === "directory");
      const trackUris = browseResult.filter((item: IBrowseResult) => item.type === "track").map((item: IBrowseResult) => item.uri);
      const pageCount = Math.ceil(trackUris.length / tracksPerPage);
      const pages: IPage[] = [];
      for (let i = 0; i < pageCount; i++) {
        const page: IPage = {
          id: i,
          loaded: false,
          trackUris: trackUris.slice(i * tracksPerPage, i * tracksPerPage + tracksPerPage),
          tracks: [],
        };
        pages.push(page)
      }
      this.setState({
        allDirUris: dirs,
        allTrackUris: trackUris,
        allTracksLoaded: false,
        currentPage: 0,
        loadedTracks: [],
        pages
      })
    });
  }

  private loadNextPage(id: number) {
    const page = this.state.pages[this.state.currentPage];
    if (page !== undefined) {
      if (!this.state.isLoading) {
        this.setState({isLoading: true});
        this.loadPage(page)
      }
    } else {
      this.setState({allTracksLoaded: true})
    }
  }

  private loadPage(page: IPage) {
    const nextPage = page.id + 1;
    Promise.all([this.props.mopidy.lookupTracks(page.trackUris),
      this.props.mopidy.getImages(page.trackUris)]
    ).then((result: [ITrack[], any]) => {
      const loadedTracks: ITrack[] = page.trackUris
          .filter((trackUri: string) => result[0][trackUri][0] !== undefined)
          .map((trackUri: string) => {
            const track: ITrack = result[0][trackUri][0];
            const cover: string[] = result[1][trackUri].map((image: any) => image.uri);
            if (track.album.images === undefined) {
              track.album.images = cover
            }
            if (track.album.images.length === 0) {
              track.album.images.push(...cover)
            }
            return track
          });
      const newLoadedTracks: ITrack[] = JSON.parse(JSON.stringify(this.state.loadedTracks));
      const newPages: IPage[] = JSON.parse(JSON.stringify(this.state.pages));
      newPages[page.id].tracks = loadedTracks;
      newPages[page.id].loaded = true;
      newLoadedTracks.push(...loadedTracks);
      this.setState({
        currentPage: nextPage,
        isLoading: false,
        loadedTracks: newLoadedTracks,
        pages: newPages,
      });
    });
  }


  private playTrack(uri: string) {
    const mopidy = this.props.mopidy;
    mopidy.stop();
    mopidy.clearTracklist();
    mopidy.addToTracklist(this.state.loadedTracks);
    mopidy.getTlTracks().then((tlTracks: ITlTrack[]) => {
      const foundTlTrack = tlTracks.find((tlTrack: ITlTrack) => tlTrack.track.uri === uri);
      if (foundTlTrack !== undefined) {
        mopidy.playTrack(foundTlTrack.tlid)
      } else {
        console.log("TRACK ID NOT FOUND.")
      }
    })
  }
}
