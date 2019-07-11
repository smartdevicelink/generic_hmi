import React from 'react';

import AlertHeader from './containers/Header';
import {AlertStrings} from './containers/Metadata'
import {AlertButtons} from './containers/Buttons';
import Image from './Templates/Shared/Image'

export default class Alert extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="alert">
                <div className="alert-title">
                    <p className="t-small t-light th-f-color">
                        {this.props.alertName}
                    </p>
                </div>
                <div className="alert-top">
                    <AlertStrings/>
                    <div className="alert-icon">
                        <Image class="svg-wrap" image={this.props.icon.value}/>
                    </div>
                </div>
                <AlertButtons class="alert-softbuttons-container"/>
            </div>
        )
    }
}