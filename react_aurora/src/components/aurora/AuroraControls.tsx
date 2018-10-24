import * as React from 'react';
import Slider from "../Slider";
import APIButton from "./APIButton";
import './AuroraControls.css';
import EffectSelect from './EffectSelect';
import OnOffSwitch from "./OnOffSwitch";

export default class AuroraControls extends React.Component<{}, {}> {
  public render() {
    return (
        <div className="auroraControls">
          <div className="list">
            <APIButton endpoint='/aurora/aurora/reboot' labelName="Reboot"/>
            <OnOffSwitch endpoint='/aurora/aurora/power' labelName="Power"/>
            <OnOffSwitch endpoint='/aurora/aurora/on' labelName="Aurora"/>
            <EffectSelect/>
            <Slider endPoint='/aurora/aurora/brightness' labelName='Brightness' min='0' max='100'/>
            <Slider endPoint='/aurora/aurora/saturation' labelName='Saturation' min='0' max='100'/>
            <Slider endPoint='/aurora/aurora/hue' labelName='Hue' min='0' max='360'/>
            <Slider endPoint='/aurora/aurora/temperature' labelName='Temperature' min='1200' max='6500'/>
          </div>
        </div>
    );
  }
}
