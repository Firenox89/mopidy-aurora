import * as React from 'react';
import {FormEvent} from "react";
import Mopidy from '../Mopidy';
import Utils from "../Utils";
import './Footer.css';
import PauseIcon from './pause.png';
import PlayIcon from './play.png';
import PreviousIcon from './previous.png';
import SkipIcon from './skip.png';

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
  volume: number
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
      volume: 50
    };

    this.props.mopidy.getTrack().then((data: any) => {
      if (data) {
        this.setTrackData(data)
      }
    });

    this.props.mopidy.getPosition().then((position: number) => {
      this.setState({position})
    });

    this.props.mopidy.getVolume().then((volume: number) => {
      this.setState({volume})
    });

    this.props.mopidy.getState().then((volume: any) => {
      this.setState({isPlaying: volume === "playing"})
    });

    this.props.mopidy.onVolume((event: any) => {
      this.setState({volume: event.volume})
    });

    this.props.mopidy.onTrackPlaybackStarted((event: any) => {
      this.setTrackData(event.tl_track.track);
      // @ts-ignore
      console.log(event)
    });

    this.pollPosition = this.pollPosition.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.previous = this.previous.bind(this);
    this.skip = this.skip.bind(this);
    this.seek = this.seek.bind(this);
    this.volume = this.volume.bind(this);
    this.setTrackData = this.setTrackData.bind(this);

    this.pollPosition()
  }

  public render() {
    return (
        <div className="footer">
          <div className="cover">
            <img src={this.state.cover} className='cover'/>
          </div>
          <div className="controls">
          <div className="bar">
            <div className="playerControl">
              <img src={PreviousIcon} className='button' onClick={this.previous}/>
              {this.state.isPlaying ?
                  <img src={PauseIcon} className='button' onClick={this.pause}/>
                  :
                  <img src={PlayIcon} className='button' onClick={this.play}/>
              }
              <img src={SkipIcon} className='button' onClick={this.skip}/>
            </div>
            <div className="volume">
              <div className="sliderContainer">
                <input type="range" min='0' max='100' value={this.state.volume}
                       className="slider"
                       id="myRange"
                       onInput={this.volume}
                       onChange={this.volume}/>
              </div>
              <div>
                <button>Mute</button>
              </div>
              <div>
                <button>Shuffle</button>
              </div>
            </div>
          </div>
          <div className="bar">
            <div className='title'>
              <div>{this.state.title}</div>
              <div>{this.state.artists}</div>
            </div>
            <div className="position">
              <div>{Utils.timestampToReadableString(this.state.position)}</div>
              <div className="positionContainer">
                <input type="range" min='0' max={this.state.length} value={this.state.position}
                       className="slider"
                       id="myRange"
                       onInput={this.seek}
                       onChange={this.seek}/>
              </div>
              <div>{Utils.timestampToReadableString(this.state.length)}</div>
            </div>
          </div>
          </div>
        </div>
    );
  }

  private pollPosition() {
    setInterval(() => {
      if (this.state.isPlaying) {
        this.props.mopidy.getPosition().then((position: number) => {
          this.setState({position})
        });
      }
    }, 1000);
  }

  private setTrackData(data: any) {
    let artists = '';
    let cover = '';
    data.artists.forEach((artist: any) => artists = artists + ' ' + artist.name);
    if (data.album.images[0]) {
      cover = data.album.images[0]
    }
    this.setState({
      artists,
      cover,
      length: data.length,
      title: data.name,
    })
  }

  private play() {
    this.props.mopidy.play();
    this.setState({isPlaying: true});
  }

  private pause() {
    this.props.mopidy.pause();
    this.setState({isPlaying: false});
  }

  private previous() {
    this.props.mopidy.previous();
  }

  private skip() {
    this.props.mopidy.skip();
  }

  private seek(event: FormEvent) {
    const newPosition = Number((event.target as HTMLInputElement).value);
    this.props.mopidy.seek(newPosition);
    this.props.mopidy.getPosition().then((position: number) => {
      this.setState({position})
    });
  }

  private volume(event: FormEvent) {
    const volume = Number((event.target as HTMLInputElement).value);
    this.props.mopidy.setVolume(volume);
  }
}
