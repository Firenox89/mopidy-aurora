import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
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


    render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
          <button onClick={() => this.sendRequest('/aurora/onoff', JSON.stringify({"on": true})) }>Aurora On</button>
          <button onClick={() => this.sendRequest('/aurora/onoff', JSON.stringify({"on": false})) }>Aurora Off</button>
      </div>
    );
  }
}

export default App;
