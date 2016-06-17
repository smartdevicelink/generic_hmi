import React from 'react';

import AlbumArt from './AlbumArt';

export default class MediaPlayerBody extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="media-player-body">
                <AlbumArt />
                <div className="media-track">

                </div>
            </div>
        )
    }
}
