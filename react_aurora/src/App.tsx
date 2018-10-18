import * as React from 'react';
import {BrowserRouter as Router, Link, Route} from "react-router-dom";
import './App.css';
import AuroraControls from './components/AuroraControls';
import Footer from './components/Footer';
import Tracks from './components/Tracks';
import Mopidy from './Mopidy';

interface IAppState {
  audioSources: IBrowseResult[]
  mopidy: Mopidy
}

interface IBrowseResult {
  type: string
  name: string
  uri: string
}

// @ts-ignore
const TrackList = ({match}) => {
  return (
      <div>
        <Tracks mopidy={new Mopidy()} uri={match.params.id}/>
      </div>
  );
};

const Aurora = () => (
    <div className="content">
      <AuroraControls/>
    </div>
);

export default class App extends React.Component<{}, IAppState> {
  constructor(props: any) {
    super(props);

    this.state = {
      audioSources: [],
      mopidy: new Mopidy(),
    };
    this.loadAudioSources()
  }

  public loadAudioSources() {
    this.state.mopidy.loadAudioSources().then((results: IBrowseResult[]) => {
      this.setState({
        audioSources: results
      });
    })
  }

  public render() {
    const audioSources: JSX.Element[] = [];
    this.state.audioSources.forEach((item: IBrowseResult, index: number) => {
      audioSources.push(
          <li key={item.uri}>
            <Link to={"/" + item.uri}>{item.name}</Link>
          </li>
      );
    });
    audioSources.push(
        <li key="aurora">
          <Link to={"/"}>Aurora</Link>
        </li>
    );
    return (
        <Router>
          <div className="App">
            <div className="audioSources">
              <div>
                <ul>
                  {audioSources}
                </ul>
              </div>
              <div className="tracks">
                <Route exact={true} path="/" component={Aurora}/>
                <Route path="/:id" component={TrackList}/>
              </div>
            </div>
            <Footer mopidy={this.state.mopidy}/>
          </div>
        </Router>
    );
  }
}
