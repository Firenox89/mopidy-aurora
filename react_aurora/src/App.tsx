import * as React from 'react';
import './App.css';
import OnOffSwitch from "./components/OnOffSwitch";
import Slider from "./components/Slider";
import EffectSelect from './components/EffectSelect';

export default class App extends React.Component<{}, {}> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    return (
        <div className="App">
          <div className="controls">
            <div className="list">
              <div className="control">
                <OnOffSwitch endpoint='/aurora/tp/on' labelName={"Power"}/>
                <OnOffSwitch endpoint='/aurora/aurora/on' labelName={"Aurora"}/>
                <EffectSelect/>
                <Slider endPoint='/aurora/aurora/brightness' labelName='Brightness' min='0' max='100'/>
                <Slider endPoint='/aurora/aurora/saturation' labelName='Saturation' min='0' max='100'/>
                <Slider endPoint='/aurora/aurora/hue' labelName='Hue' min='0' max='360'/>
                <Slider endPoint='/aurora/aurora/temperature' labelName='Temperature' min='1200' max='6500'/>
              </div>
            </div>
          </div>
        </div>
    );
  }
}
