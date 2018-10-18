import * as React from 'react';
import Utils from "../Utils";
import './OnOffSwitch.css';

interface IOnOffSwitchProps {
  endpoint: string,
  labelName: string
}

interface IOnOffSwitchState {
  on: boolean
}

export default class OnOffSwitch extends React.Component<IOnOffSwitchProps, IOnOffSwitchState> {
  constructor(props: IOnOffSwitchProps) {
    super(props);
    const self = this;
    this.state = {
      on: false
    };
    Utils.sendGetRequest(props.endpoint, (response: string) => {
      const isTrue = (response === 'true');
      self.setState({on: isTrue})
    });

    this.handleValueChange = this.handleValueChange.bind(this)
  }

  public render() {
    return (
        <div className="auroraSwitch">
          <div className="switchLabel">{this.props.labelName}</div>
          <div className="onoffswitch">
            <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox"
                   id={this.props.labelName}
                   checked={this.state.on} onChange={this.handleValueChange}/>
            <label className="onoffswitch-label" htmlFor={this.props.labelName}>
              <span className="onoffswitch-inner"/>
              <span className="onoffswitch-switch"/>
            </label>
          </div>
        </div>
    );
  }

  private handleValueChange() {
    const on = !this.state.on;
    this.setState({on});
    Utils.sendPutRequest(this.props.endpoint, JSON.stringify({on}))
  }
}