import React from 'react';

import AppHeader from './containers/Header';
import { MediaMetadata } from './containers/Metadata';
import ProgressBar from './containers/ProgressBar_c';
import Buttons from './containers/Buttons';

export default class MediaPlayer extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="media-template">
                <AppHeader backLink="/" menuName="Apps"/>
                <MediaMetadata />
                <ProgressBar />
                <Buttons />
            </div>
        )
    }
}
