import React from 'react';

import AppHeader from './containers/Header';
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
                <AppHeader appIcon="false" backLink=""/>
                <div className="alert-top">
                    <AlertStrings/>
                    <div className="alert-icon">
                        <span key="icon" className="svg-wrap" dangerouslySetInnerHTML={{__html: alertIcon}} />
                    </div>
                </div>
                <AlertButtons class="alert-softbuttons-container"/>
            </div>
        )
    }
}