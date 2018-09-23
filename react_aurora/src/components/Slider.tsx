import * as React from 'react';
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
    }
    Utils.sendGetRequest(props.endPoint, (response: string) => {
      self.setState({value: response})
    });
  }

  private handleValueChange(value: string) {
    this.setState({value});
    Utils.sendPutRequest(this.props.endPoint, value)
  }

  public render() {
    return (
        <div className="sliderContainer">
          <div>{this.props.labelName}</div>
          <input type="range" min={this.props.min} max={this.props.max} value={this.state.value}
                 className="slider"
                 id="myRange"
                 onInput={event => {
                   this.handleValueChange((event.target as HTMLInputElement).value)
                 }}
                 onChange={event => {
                   this.handleValueChange(event.target.value)
                 }}/>
        </div>
    );
  }
}
