import * as React from 'react';
import {FormEvent} from "react";
import Utils from '../Utils';
import './Slider.css';

interface ISliderProps {
  endPoint: string,
  labelName: string,
  min: string,
  max: string
}

interface ISliderState {
  value: string,
}

export default class Slider extends React.Component<ISliderProps, ISliderState> {
  constructor(props: ISliderProps) {
    super(props);
    const self = this;
    this.state = {
      value: '50'
    };
    Utils.sendGetRequest(props.endPoint, (response: string) => {
      self.setState({value: response})
    });

    this.handleValueChange = this.handleValueChange.bind(this)
  }

  public render() {
    return (
        <div className="sliderContainer">
          <div>{this.props.labelName}</div>
          <input type="range" min={this.props.min} max={this.props.max} value={this.state.value}
                 className="slider"
                 id="myRange"
                 onInput={this.handleValueChange}
                 onChange={this.handleValueChange}/>
        </div>
    );
  }

  private handleValueChange(event: FormEvent) {
    const value = (event.target as HTMLInputElement).value;
    this.setState({value});
    Utils.sendPutRequest(this.props.endPoint, value)
  }
}
