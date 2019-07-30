import React from 'react';

import AlertHeader from './containers/Header';
import {AlertStrings} from './containers/Metadata'
import {AlertButtons} from './containers/Buttons';
import Image from './Templates/Shared/Image'
import StaticIcon from './Templates/Shared/StaticIcon'

export default class Alert extends React.Component {
    constructor() {
        super();
    }

    render() {
        var icon = (this.props.icon.imageType === "STATIC")
                 ? (<StaticIcon class="alert-icon" image={this.props.icon.value} />)
                 : (<div className="alert-icon"><Image class="icon" image={this.props.icon.value} /></div>);

        return (
            <div className="alert">
                <div className="alert-title">
                    <p className="t-small t-light th-f-color">
                        {this.props.alertName}
                    </p>
                </div>
                <div className="alert-top">
                    <AlertStrings/>
                    { icon }
                </div>
                <AlertButtons class="alert-softbuttons-container"/>
            </div>
        )
    }
}