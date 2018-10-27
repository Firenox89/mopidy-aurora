import * as React from 'react';
// import InfiniteScroll from 'react-infinite-scroller';
import ReactLoading from "react-loading";
import Mopidy from '../mopidy/MopidyHelper';
import {ITlTrack, ITrack} from "../mopidy/MopidyInterfaces";
import Utils from "../Utils";
import TrackListItem from "./TrackListItem";
import './Tracks.css';

const tracksPerPage = 30;

interface ITracksProps {
  mopidy: Mopidy
  uri: string
}

interface ITracksState {
  allDirUris: IBrowseResult[]
  allTrackUris: string[]
  currentPageID: number
  isLoading: boolean
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
      currentPageID: 0,
      isLoading: false,
      pages: [],
    };

    this.renderTrackInfo = this.renderTrackInfo.bind(this);
    this.playTrack = this.playTrack.bind(this);
    this.hasNewPages = this.hasNewPages.bind(this);
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
    let pageContent: JSX.Element = <div/>;
    if (this.state.isLoading) {
      pageContent = <div className="loadingContainer"><ReactLoading type="spin" color="#FFF"/></div>
    } else {
      const pageElements: JSX.Element[] = [];
      const currentPage = this.state.pages[this.state.currentPageID];
      if (currentPage === undefined && this.state.allDirUris.length === 0) { return <div>Page is undefined</div>; }
      if (currentPage !== undefined && !currentPage.loaded) {
        this.loadPage(currentPage)
      }
      for (let i = 0; i < this.state.pages.length; i++) {
        pageElements.push(
            <button className="pageButton" key={i} onClick={() => this.handlePageSwitch(i)}>{i + 1}</button>
        )
      }
      pageContent = <div>
        <div className="pageButtons">
          {pageElements}
        </div>
        <div className="trackList">
          {this.renderDirs(this.state.allDirUris)}
          {currentPage !== undefined && this.renderTrackInfo(currentPage.tracks)}
        </div>
        <div className="pageButtons">
          {pageElements}
        </div>
      </div>
    }
    return (
        <div className="tracks">
          {pageContent}
        </div>
    );
  }

  public componentWillReceiveProps(nextProps: ITracksProps) {
    this.loadAudioSources(nextProps.uri)
  }

  private handlePageSwitch(pageID: number) {
    this.setState({
      currentPageID: pageID
    })
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
        pages
      })
    });
  }

  private hasNewPages() {
    return this.state.pages.length > this.state.currentPageID;
  }

  private loadNextPage() {
    if (this.hasNewPages()) {
      this.loadPage(this.state.pages[this.state.currentPageID+1])
    }
  }

  private loadPage(page: IPage) {
    this.setState({isLoading: true});
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
      const newPages: IPage[] = JSON.parse(JSON.stringify(this.state.pages));
      newPages[page.id].tracks = loadedTracks;
      newPages[page.id].loaded = true;
      this.setState({
        isLoading: false,
        pages: newPages,
      });
    });
  }


  private playTrack(uri: string) {
    const mopidy = this.props.mopidy;
    mopidy.stop();
    mopidy.clearTracklist();
    mopidy.addToTracklist(this.state.pages[this.state.currentPageID].tracks);
    mopidy.getTlTracks().then((tlTracks: ITlTrack[]) => {
      const foundTlTrack = tlTracks.find((tlTrack: ITlTrack) => tlTrack.track.uri === uri);
      if (foundTlTrack !== undefined) {
        mopidy.playTrack(foundTlTrack.tlid)
      }
    })
  }
}
