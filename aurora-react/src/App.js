import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            powerChecked: true,
            auroraChecked: true,
            auroraBrightness: 50,
            auroraEffectList: [],
            auroraEffect: ""
        };

        const self = this;
        this.sendGetRequest('/aurora/aurora/effect_list', function (response) {
            self.setState({auroraEffectList: JSON.parse(response)})
        });
        this.sendGetRequest('/aurora/aurora/effect', function (response) {
            self.setState({auroraEffect: response})
        });
        this.sendGetRequest('/aurora/aurora/brightness', function (response) {
            self.setState({auroraBrightness: response})
        });
    }

    sendGetRequest(endpoint, callback) {
        let xhttp = new XMLHttpRequest();
        xhttp.open('GET', endpoint, true);
        xhttp.setRequestHeader('Content-type', 'application/json');
        xhttp.onreadystatechange = function () {
            //wait until response was loaded
            if (xhttp.readyState === XMLHttpRequest.DONE && this.status === 200) {
                callback(xhttp.responseText)
            }
        };
        xhttp.send();
    }

    sendPutRequest(endpoint, body) {
        let xhttp = new XMLHttpRequest();
        xhttp.open('PUT', endpoint, true);
        xhttp.setRequestHeader('Content-type', 'application/json');
        xhttp.onreadystatechange = function () {
            //wait until response was loaded
            if (xhttp.readyState === 4) {
                console.log("On")
            }
        };
        xhttp.send(body);
    }

    handlePower() {
        this.setState({
            powerChecked: !this.state.powerChecked,
        });
    }

    handleAurora() {
        this.setState({
            auroraChecked: !this.state.auroraChecked,
        });
        this.sendPutRequest('/aurora/aurora/on', JSON.stringify({"on": this.state.auroraChecked}));
    }

    handleAuroraSelect(select) {
        this.setState({
            auroraEffect: select.target.value,
            auroraChecked: true,
        });
        this.sendPutRequest('/aurora/aurora/effect', select.target.value)
    }

    handleBrightness(event) {
        this.setState({
            auroraBrightness: event.target.value
        });
        this.sendPutRequest('/aurora/aurora/brightness', event.target.value)
    }

    render() {
        const effectOptions = [];
        this.state.auroraEffectList.forEach(function (item, index) {
            effectOptions.push(
                <option value={item}>{item}</option>
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
                                this.handleAuroraSelect(event)
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
                                       onInput={(event) => {
                                           this.handleBrightness(event)
                                       }}
                                       onChange={(event) => {
                                           this.handleBrightness(event)
                                       }}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
