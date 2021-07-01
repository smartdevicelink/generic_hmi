import React from 'react';

import { AlertStrings } from './containers/Metadata'
import { AlertButtons } from './containers/Buttons';
import Image from './Templates/Shared/Image'
import StaticIcon from './Templates/Shared/StaticIcon'
import store from './store.js'
import { alertTimeoutReseted } from './actions'
import UIController from './Controllers/UIController'
import TTSController from './Controllers/TTSController'
import EventEmitter from "reactjs-eventemitter";

const OUT_OF_BOUND_RESET_PERIOD = 1000;
export default class Alert extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alertCounter: 5,
            ifSpeak: true,
            speakCounter: 5,
            ttsStoped: false
        }
        this.pressResetTimeoutButton = this.pressResetTimeoutButton.bind(this);
        EventEmitter.subscribe('TTSTimeout', () => {
            this.setState({ ttsStoped: true });
        })
    }

    pressResetTimeoutButton(event) {
        store.dispatch(alertTimeoutReseted(true));

        let count = store.getState().ui[store.getState().activeApp].resetTimeout.resetTimeoutValue / 1000;
        if (count > OUT_OF_BOUND_RESET_PERIOD) {
            EventEmitter.emit('OUT_OF_BOUND');
            return;
        }
        this.setState({ alertCounter: count });
        UIController.resetAlertTimeout()

    }
    changeCounter() {
        this.setState(prevState => ({ alertCounter: prevState.alertCounter > 0 ? prevState.alertCounter - 1 : '' }))
        this.setState(prevState => ({ speakCounter: prevState.speakCounter > 0 ? prevState.speakCounter - 1 : '' }))
    }
    componentDidMount() {
        this.interval = setInterval(() => this.changeCounter(), 1000)
    }
    componentWillUnmount() {
        clearInterval(this.interval)
    }


    render() {
        var fill = this.props.theme ? "#FFFFFF" : "#000000";
        var icon = this.props.icon ? this.props.icon : { imageType: "STATIC", value: "0xFE" }

        var iconElement = (icon.imageType === "STATIC")
            ? (<StaticIcon class="alert-icon" image={icon.value} />)
            : (<div className="alert-icon"><Image class="icon" image={icon.value} isTemplate={icon.isTemplate} fillColor={fill} /></div>);

        let resetTimeoutHTML = undefined;
        if (store.getState().ui[store.getState().activeApp].alert.softButtons == undefined) {
            let resetSpeakTimeoutHTML = undefined;

            resetTimeoutHTML = undefined;
            if (this.state.alertCounter > 0) {
                resetTimeoutHTML = <><div className="alert-reset-box"><div className="timeout-box">
                    <p>UI.Alert: {this.state.alertCounter}</p>
                    {resetSpeakTimeoutHTML}
                </div>
                    <button className="reset-button" onClick={this.pressResetTimeoutButton}>Reset Timeout</button></div></>
            }
        }

        return (
            <div className="alert">
                <div className="alert-title">
                    <p className="t-small t-light th-f-color">
                        {this.props.alertName}
                    </p>
                </div>
                <div className="alert-top">
                    <AlertStrings />
                    {iconElement}
                </div>
                <AlertButtons classPrefix="alert" />
                {resetTimeoutHTML}
            </div>
        )
    }
}