import * as React from 'react';
import Mopidy from '../Mopidy';
import './Footer.css';
import PauseIcon from './pause.png';
import PlayIcon from './play.png';
import PreviousIcon from './previous.png';
import SkipIcon from './skip.png';
import {FormEvent} from "react";

interface IFooterProps {
  mopidy: Mopidy
}

interface IFooterState {
  artists: string
  cover?: string
  isPlaying: boolean
  title: string
  length: number
  position: number
}

export default class Footer extends React.Component<IFooterProps, IFooterState> {
  constructor(props: any) {
    super(props);

    this.state = {
      artists: "",
      isPlaying: false,
      length: 0,
      position: 0,
      title: "",
    };

    this.props.mopidy.getTrack().then((data: any) => {
      console.log(data);
      let artists = '';
      let cover = '';
      data.artists.forEach((artist: any) => artists = artists + ' ' +artist.name);
      if (data.album.images[0]) {
        cover = data.album.images[0]
      }
      this.setState({
        artists,
        length: data.length,
        title: data.name,
        cover
      })
    });

    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.previous = this.previous.bind(this);
    this.skip = this.skip.bind(this);
    this.seek = this.seek.bind(this);
    this.postionToReadableString = this.postionToReadableString.bind(this);
  }

  play() {
    this.props.mopidy.play();
    this.setState({isPlaying: true});
  }

  pause() {
    this.props.mopidy.pause();
    this.setState({isPlaying: false});
  }

  previous() {
    this.props.mopidy.previous();
  }

  skip() {
    this.props.mopidy.skip();
  }

  seek(event: FormEvent) {
    const position = Number((event.target as HTMLInputElement).value);
    this.props.mopidy.seek(position);
  }

  postionToReadableString(pos: number) {
    const minutes = Math.round(pos/60_000);
    const seconds = Math.round((pos%60_000)/1000);
    return minutes + ":" + ((seconds<10) ? 0 : '') + seconds
  }

  public render() {
    return (
        <div className="footer">
          <div className="playerControl">
            <img src={PreviousIcon} className='button' onClick={this.previous}/>
            {this.state.isPlaying ?
                <img src={PauseIcon} className='button' onClick={this.pause}/>
                :
                <img src={PlayIcon} className='button' onClick={this.play}/>
            }
            <img src={SkipIcon} className='button' onClick={this.skip}/>
          </div>
          <div>
            <img src={this.state.cover} className='button'/>
          </div>
          <div className='title'>
            <div>{this.state.title}</div>
            <div>{this.state.artists}</div>
          </div>
          <div>{this.postionToReadableString(this.state.position)}</div>
          <div className="sliderContainer">
            <input type="range" min='0' max={this.state.length} value={this.state.position}
                   className="slider"
                   id="myRange"
                   onInput={this.seek}
                   onChange={this.seek}/>
          </div>
          <div>{this.postionToReadableString(this.state.length)}</div>
        </div>
    );
  }
}
