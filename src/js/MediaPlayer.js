import React from 'react';

import AppHeader from './AppHeader';
import { MediaMetadata } from './containers/Metadata';
import ProgressBar from './ProgressBar';
import Buttons from './containers/Buttons';

export default class MediaPlayer extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <AppHeader backLink="/" menuName="Apps"/>
                <MediaMetadata />
                <ProgressBar />
                <Buttons />
            </div>
        )
    }
}
