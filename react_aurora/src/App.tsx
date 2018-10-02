import * as React from 'react';
import Mopidy from './Mopidy';
import './App.css';
import Footer from './components/Footer';
import AuroraControls from './components/AuroraControls';
import Tracks from './components/Tracks';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";

interface IAppState {
  mopidy: Mopidy
  audioSources: IBrowseResult[]
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
      mopidy: new Mopidy(),
      audioSources: []
    };
    this.loadAudioSources()
  }

  loadAudioSources() {
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
            <div className="content2">
              <div>
                <ul>
                  {audioSources}
                </ul>
              </div>
              <Route exact path="/" component={Aurora}/>
              <Route path="/:id" component={TrackList}/>
            </div>
            <Footer mopidy={this.state.mopidy}/>
          </div>
        </Router>
    );
  }
}
