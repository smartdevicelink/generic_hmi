import React from 'react';

import AlertHeader from './containers/Header';
import {AlertStrings} from './containers/Metadata'
import {AlertButtons} from './containers/Buttons';

import alertIcon from '../img/icons/icon-alert.svg'

export default class MediaPlayer extends React.Component {
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
                        <img key="icon" className="svg-wrap" src={this.props.alertIcon.value} />
                    </div>
                </div>
                <AlertButtons class="alert-softbuttons-container"/>
            </div>
        )
    }
}