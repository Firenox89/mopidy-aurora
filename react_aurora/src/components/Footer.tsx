import * as React from 'react';
import './Footer.css';
import PlayIcon from './play.png';
import PauseIcon from './pause.png';
import PreviousIcon from './previous.png';
import SkipIcon from './skip.png';

interface IFooterState {
  artist: string
  isPlaying: boolean
  title: string
}

export default class Footer extends React.Component<{}, IFooterState> {
  constructor(props: any) {
    super(props);
    this.state = {
      artist: "",
      isPlaying: false,
      title: "",
    }

  }

  handlePlay() {
  }

  handlePause() {
  }

  handlePrevious() {
  }

  handleSkip() {
  }

  public render() {
    return (
        <div className="footer">
          <div className="playerControl">
            <img src={PreviousIcon} className='button' onClick={this.handlePrevious}/>
            {this.state.isPlaying ?
                <img src={PauseIcon} className='button' onClick={this.handlePause}/>
                :
                <img src={PlayIcon} className='button' onClick={this.handlePlay}/>
            }
            <img src={SkipIcon} className='button' onClick={this.handleSkip}/>
          </div>
          <div>
            <div>{this.state.title}</div>
            <div>{this.state.artist}</div>
          </div>
          <div className="iconLicense">
            <div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a
                href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a
                href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC
              3.0
              BY</a></div>
          </div>
        </div>
    );
  }
}
