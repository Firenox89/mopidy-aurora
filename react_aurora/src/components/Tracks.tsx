import * as React from 'react';
import Mopidy from '../Mopidy';
import './Tracks.css';
import {Link} from "react-router-dom";

interface IFooterProps {
  mopidy: Mopidy
  uri: string
}

interface IFooterState {
  tracks: IBrowseResult[]
}

interface IBrowseResult {
  type: string
  name: string
  uri: string
}

export default class Footer extends React.Component<IFooterProps, IFooterState> {
  constructor(props: any) {
    super(props);

    this.state = {
      tracks: []
    };

    this.loadAudioSources = this.loadAudioSources.bind(this);

    this.loadAudioSources(this.props.uri)
  }

  loadAudioSources(uri: string) {
    this.props.mopidy.browse(uri).then((results: IBrowseResult[]) => {
      this.setState({
        tracks: results
      });
    })
  }
  componentWillReceiveProps(nextProps: IFooterProps){
    this.loadAudioSources(nextProps.uri)
  }
  public render() {
    const tracks: JSX.Element[] = [];
    this.state.tracks.forEach((item: IBrowseResult, index: number) => {
      tracks.push(
          <div className="track">
            <Link to={"/" + item.uri}>{item.name}</Link>
          </div>
      );
    });
    return (
        <div className="tracks">
          {tracks}
        </div>
    );
  }
}
