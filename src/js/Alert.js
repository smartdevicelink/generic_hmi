import React from 'react';

import {AlertStrings} from './containers/Metadata'
import {AlertButtons} from './containers/Buttons';
import Image from './Templates/Shared/Image'
import StaticIcon from './Templates/Shared/StaticIcon'
import store from './store.js'
import { alertTimeoutReseted } from './actions'
import Controller from './Controllers/UIController'

export default class Alert extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alertChecked: true,
            alertCounter: 5,
            ifSpeak: true,
            speakChecked: true,
            speakCounter: 5
        }
        this.pressResetTimeoutButton = this.pressResetTimeoutButton.bind(this);
    }

    pressResetTimeoutButton(event) { 
        store.dispatch(alertTimeoutReseted(true));

        let count = store.getState().ui[store.getState().activeApp].resetTimeout.resetTimeoutValue/1000;
        this.setState({alertCounter: count});
        this.setState({speakCounter: ''}); 
        Controller.resetAlertTimeout()
        // if (this.state.alertChecked && this.state.speakChecked) {
        //     this.setState({alertCounter: count});
        //     this.setState({speakCounter: count})
        //     Controller.resetAlertTimeout()
        // } else if (this.state.alertChecked) {
        //     this.setState({alertCounter: count});
        //     this.setState({speakCounter: ''}); 
        //     Controller.resetAlertTimeout()
        // } else if (this.state.speakChecked) {
        //     this.setState({alertCounter: ''});
        //     this.setState({speakCounter: count});
        //     store.dispatch(alertTimeoutReseted({appID: store.getState().activeApp})); 
        //     Controller.resetAlertTimeout()
        // }
        
    }
    changeCounter() {
        if(this.state.alertChecked) {
            this.setState(prevState => ({alertCounter: prevState.alertCounter - 1}))
        }
        if(this.state.speakChecked) {
            this.setState(prevState => ({speakCounter: prevState.speakCounter - 1}))
        }
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

        let speakCheckbox = undefined;
        // if (this.state.ifSpeak) {
        //     speakCheckbox = ( 
        //         <>
        //             <p>
        //             <input
        //                 name="Speak" 
        //                 type="checkbox"
        //                 defaultChecked={this.state.speakChecked}
        //                 onChange={() => this.setState(prevState => ({speakChecked: !prevState.speakChecked}))} />
        //             <label>Speak</label>
        //             </p>
        //         </>
        //     );
        // }

        let speakCounter = undefined;
        // if (this.state.ifSpeak) {
        //     speakCounter =
        //     <>
        //         <p>TTS.Speak: {this.state.speakCounter}</p>
        //     </>
        // }
        let resetTimeoutHTML = store.getState().ui[store.getState().activeApp].alert.softButtons !== undefined ?
        undefined :
        <><div className="timeout-box">
            <p>UI.Alert: {this.state.alertCounter}</p>
            </div>
        <button className="reset-button" onClick={this.pressResetTimeoutButton}>Reset Timeout</button></>

        return (
            <div className="alert">
                <div className="alert-title">
                    <p className="t-small t-light th-f-color">
                        {this.props.alertName}
                    </p>
                </div>
                <div className="alert-top">
                    <AlertStrings/>
                    { iconElement }
                </div>
                <AlertButtons classPrefix="alert"/>
                <div className="alert-reset-box">
                    <div className="checkItems">
                        <p>
                            <label>Alert</label>
                        </p>
                        {speakCheckbox}
                    </div>
                    {resetTimeoutHTML}
                </div>
            </div>
        )
    }
}