import React from 'react';

import AppHeader from './AppHeader';
import MediaPlayerBody from './MediaPlayerBody';
import ProgressBar from './ProgressBar';
import ControlBar from './ControlBar';

export default class MediaPlayer extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <AppHeader menuName="Apps" appName="Spotify" />
                <MediaPlayerBody />
                <ProgressBar />
                <ControlBar />
            </div>
        )
    }
}
