import * as React from 'react';
import {BrowserRouter as Router, Link, Route} from "react-router-dom";
import './App.css';
import AuroraControls from './components/aurora/AuroraControls';
import Footer from './components/footer/Footer';
import Tracks from './components/Tracks';
import Mopidy from './mopidy/MopidyHelper';

const mopidy = new Mopidy();

interface IAppState {
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
        <Tracks mopidy={mopidy} uri={decodeURIComponent(match.params.id)}/>
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
    };
    this.loadAudioSources()
  }

  public loadAudioSources() {
    if (mopidy.isOnline) {
      mopidy.loadAudioSources().then((results: IBrowseResult[]) => {
        this.setState({
          audioSources: results
        });
      })
    } else {
      mopidy.onOnline(() => {
        mopidy.loadAudioSources().then((results: IBrowseResult[]) => {
          this.setState({
            audioSources: results
          });
        })
      })
    }
  }

  public render() {
    const audioSources: JSX.Element[] = [];
    this.state.audioSources.forEach((item: IBrowseResult, index: number) => {
      audioSources.push(
          <div key={item.uri} className="menuEntry">
            <Link to={"/" + encodeURIComponent(item.uri)}>{item.name}</Link>
          </div>
      );
    });
    audioSources.push(
        <div key="aurora" className="menuEntry">
          <Link to={"/"}>Aurora</Link>
        </div>
    );
    return (
        <Router>
          <div className="App">
            <div className="mainContent">
              <div className="sidemenu">
                  {audioSources}
              </div>
              <div className="contentContainer">
                <Route exact={true} path="/" component={Aurora}/>
                <Route path="/:id" component={TrackList}/>
              </div>
            </div>
            <Footer mopidy={mopidy}/>
          </div>
        </Router>
    );
  }
}
