import React from 'react';

import AppHeader from './containers/Header';
import {AlertStrings} from './containers/Metadata'
import {SoftButtons} from './containers/Buttons';

export default class MediaPlayer extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <AppHeader backLink="/" menuName="Apps"/>
                <AlertStrings/>
            </div>
        )
    }
}