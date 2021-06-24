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
            counter: 5
        }
        this.pressResetTimeoutButton = this.pressResetTimeoutButton.bind(this);
    }


    pressResetTimeoutButton(event) { 
        store.dispatch(alertTimeoutReseted(true));

        let count = store.getState().ui[store.getState().activeApp].resetTimeout.resetTimeoutValue/1000;
        this.setState({counter: count})
        Controller.resetAlertTimeout()
    }
    changeCounter() {
        this.setState(prevState => ({
            counter: prevState.counter - 1
        }))
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
                        {/*TODO:*/}
                        <input
                            name="Alert"            
                            type="checkbox"
                            checked={() => console.log('checked')}
                            onChange={() => console.log('checked and do something')} />
                        <p>Alert</p>
                    </div>
                    <div className="timeout-box">
                        <p>UI.Alert: {this.state.counter}</p>
                        {/*TODO:*/}
                        <p>TTS.Speak: counter</p>
                    </div>
                    <button className="reset-button" onClick={this.pressResetTimeoutButton}>Reset Timeout</button>
                </div>
            </div>
        )
    }
}