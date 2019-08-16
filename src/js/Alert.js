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
        var fill = this.props.theme ? "#FFFFFF" : "#000000";
        
        if (this.props.icon == undefined) {
            this.props.icon = { imageType: "STATIC", value: "0xFE" };
        }

        var icon = (this.props.icon.imageType === "STATIC")
                 ? (<StaticIcon class="alert-icon" image={this.props.icon.value} />)
                 : (<div className="alert-icon"><Image class="icon" image={this.props.icon.value} isTemplate={this.props.icon.isTemplate} fillColor={fill} /></div>);

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