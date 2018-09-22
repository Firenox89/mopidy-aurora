import * as React from 'react';
import './App.css';

import logo from './logo.svg';

interface IMyComponentState {
  auroraBrightness: string
  auroraChecked: boolean
  auroraEffect: string
  auroraEffectList: string[]
  powerChecked: boolean
}

export default class App extends React.Component<{}, IMyComponentState> {
  constructor(props: any) {
    super(props);
    this.state = {
      auroraBrightness: '50',
      auroraChecked: true,
      auroraEffect: "",
      auroraEffectList: [],
      powerChecked: true,
    };

    const self = this;
    this.sendGetRequest('/aurora/aurora/effect_list', (response: string) => {
      self.setState({auroraEffectList: JSON.parse(response)})
    });
    this.sendGetRequest('/aurora/aurora/effect', (response: string) => {
      self.setState({auroraEffect: response})
    });
    this.sendGetRequest('/aurora/aurora/brightness', (response: string) => {
      self.setState({auroraBrightness: response})
    });
    this.sendGetRequest('/aurora/aurora/on', (response: string) => {
      // yeah, this doesn't make much sense...
      const isTrue = (response !== 'true');
      self.setState({auroraChecked: isTrue})
    });
  }

  public render() {
    const effectOptions: JSX.Element[] = [];
    this.state.auroraEffectList.forEach((item: string, index: number) => {
      effectOptions.push(
          <option key={item} value={item}>{item}</option>
      );
    });
    return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <div className="controls">
            <div className="list">
              <div className="control">
                <div className="auroraSwitch">
                  <div className="switchLabel">Smart Plug</div>
                  <div className="onoffswitch">
                    <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox"
                           id="powerSwitch"
                           checked={this.state.powerChecked} onChange={() => this.handlePower()}/>
                    <label className="onoffswitch-label" htmlFor="powerSwitch">
                      <span className="onoffswitch-inner"/>
                      <span className="onoffswitch-switch"/>
                    </label>
                  </div>
                </div>
              </div>
              <div className="control">
                <div className="auroraSwitch">
                  <div className="switchLabel">Aurora</div>
                  <div className="onoffswitch">
                    <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox"
                           id="myonoffswitch"
                           checked={this.state.auroraChecked} onChange={() => this.handleAurora()}/>
                    <label className="onoffswitch-label" htmlFor="myonoffswitch">
                      <span className="onoffswitch-inner"/>
                      <span className="onoffswitch-switch"/>
                    </label>
                  </div>
                </div>
              </div>
              <div className="control">
                <label htmlFor="title">Title</label>
                <select id="title" name="title" value={this.state.auroraEffect} onChange={event => {
                  this.handleAuroraSelect(event.target.value)
                }}>
                  {effectOptions}
                </select>
              </div>
              <div className="control">
                <div className="slidecontainer">
                  <div>Brightness</div>
                  <input type="range" min="1" max="100" value={this.state.auroraBrightness}
                         className="slider"
                         id="myRange"
                         onInput={event => {
                           this.handleBrightness((event.target as HTMLInputElement).value)
                         }}
                         onChange={event => {
                           this.handleBrightness(event.target.value)
                         }}/>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }

  private sendGetRequest(endpoint: string, callback: (response: string) => void) {
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', endpoint, true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.onreadystatechange = () => {
      // wait until response was loaded
      if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
        callback(xhttp.responseText)
      }
    };
    xhttp.send();
  }

  private sendPutRequest(endpoint: string, body: string) {
    // tslint:disable-next-line:no-console
    console.log(endpoint);
    // tslint:disable-next-line:no-console
    console.log(body);
    const xhttp = new XMLHttpRequest();
    xhttp.open('PUT', endpoint, true);
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.onreadystatechange = () => {
      // wait until response was loaded
      if (xhttp.readyState === 4 && xhttp.status !== 200) {
        // tslint:disable-next-line:no-console
        console.log(xhttp.responseText)
      }
    };
    xhttp.send(body);
  }

  private handlePower() {
    this.setState({
      powerChecked: !this.state.powerChecked,
    });
  }

  private handleAurora() {
    this.setState({
      auroraChecked: !this.state.auroraChecked,
    });
    this.sendPutRequest('/aurora/aurora/on', JSON.stringify({"on": this.state.auroraChecked}));
  }

  private handleAuroraSelect(selected: string) {
    this.setState({
      auroraChecked: true,
      auroraEffect: selected,
    });
    this.sendPutRequest('/aurora/aurora/effect', selected)
  }

  private handleBrightness(brightness: string) {
    this.setState({
      auroraBrightness: brightness
    });
    this.sendPutRequest('/aurora/aurora/brightness', brightness)
  }
}
