import * as React from 'react';
import {FormEvent} from "react";
import Utils from '../../Utils';
import './EffectSelect.css';

interface IEffectSelectState {
  effect: string,
  effects: string[],
}

export default class EffectSelect extends React.Component<{}, IEffectSelectState> {
  constructor(props: any) {
    super(props);
    this.state = {
      effect: '',
      effects: []
    };
    const self = this;
    Utils.sendGetRequest('/aurora/aurora/effect_list', (response: string) => {
      self.setState({effects: JSON.parse(response)})
    });
    Utils.sendGetRequest('/aurora/aurora/effect', (response: string) => {
      self.setState({effect: response})
    });

    this.handleAuroraSelect = this.handleAuroraSelect.bind(this)
  }

  public render() {
    const effectOptions: JSX.Element[] = [];
    this.state.effects.forEach((item: string, index: number) => {
      effectOptions.push(
          <option key={item} value={item}>{item}</option>
      );
    });
    return (
        <div className="effectSelectContainer">
          <div>Effect</div>
          <select id="title" name="title" className="effectSelect" value={this.state.effect} onChange={this.handleAuroraSelect}>
            {effectOptions}
          </select>
        </div>
    );
  }

  private handleAuroraSelect(event: FormEvent) {
    const selected = (event.target as HTMLInputElement).value;
    this.setState({
      effect: selected,
    });
    Utils.sendPutRequest('/aurora/aurora/effect', selected)
  }

}
