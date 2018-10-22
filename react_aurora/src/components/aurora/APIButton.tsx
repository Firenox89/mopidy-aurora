import * as React from 'react';
import Utils from "../../Utils";
import './APIButton.css';

interface IAPIButtonProps {
  endpoint: string,
  labelName: string
}

export default class APIButton extends React.Component<IAPIButtonProps, {}> {
  constructor(props: IAPIButtonProps) {
    super(props);
    this.callAPI = this.callAPI.bind(this)
  }

  public render() {
    return (
        <div className="auroraSwitch">
          <div className="apiButtonLabel">{this.props.labelName}</div>
          <div className="apibuttoncontainer">
            <button type="button" name="apibutton" className="apibutton"
                   id={this.props.labelName}
                    onClick={this.callAPI}>
              {this.props.labelName}
            </button>
            <label className="onoffswitch-label" htmlFor={this.props.labelName}>
            </label>
          </div>
        </div>
    );
  }

  private callAPI() {
    Utils.sendPutRequest(this.props.endpoint, '')
  }
}
