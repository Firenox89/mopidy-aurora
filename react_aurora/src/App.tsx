import * as React from 'react';
import Mopidy from './Mopidy';
import './App.css';
import EffectSelect from './components/EffectSelect';
import Footer from './components/Footer';
import OnOffSwitch from "./components/OnOffSwitch";
import Slider from "./components/Slider";

interface IAppState {
  mopidy: Mopidy
}

export default class App extends React.Component<{}, IAppState> {
  constructor(props: any) {
    super(props);

    this.state = {
      mopidy: new Mopidy()
    }
  }

  public render() {
    return (
        <div className="App">
          <div className="list">
            <OnOffSwitch endpoint='/aurora/tp/on' labelName={"Power"}/>
            <OnOffSwitch endpoint='/aurora/aurora/on' labelName={"Aurora"}/>
            <EffectSelect/>
            <Slider endPoint='/aurora/aurora/brightness' labelName='Brightness' min='0' max='100'/>
            <Slider endPoint='/aurora/aurora/saturation' labelName='Saturation' min='0' max='100'/>
            <Slider endPoint='/aurora/aurora/hue' labelName='Hue' min='0' max='360'/>
            <Slider endPoint='/aurora/aurora/temperature' labelName='Temperature' min='1200' max='6500'/>
          </div>
          <Footer mopidy={this.state.mopidy}/>
        </div>
    );
  }
}
