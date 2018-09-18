import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            auroraChecked: true,
            powerChecked: true,
        };
    }

    sendRequest(endpoint, body) {
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
        console.log("auroa");
        this.setState({
            auroraChecked: !this.state.auroraChecked,
        });
        this.sendRequest('/aurora/onoff', JSON.stringify({"on": this.state.auroraChecked}));
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <div className="controls">
                    <div className="list">
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
                </div>
            </div>
        );
    }
}

export default App;
