import React from 'react';

import AppHeader from './AppHeader';
import { MediaMetadata } from './containers/Metadata';
import ProgressBar from './ProgressBar';
import ControlBar from './ControlBar';

export default class MediaPlayer extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <AppHeader backLink="/" menuName="Apps" appName="Spotify" />
                <MediaMetadata />
                <ProgressBar />
                <ControlBar />
            </div>
        )
    }
}
