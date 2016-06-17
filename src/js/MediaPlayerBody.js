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
                    <p className="t-small t-medium fc-white">mainField3</p>
                    <p className="t-large t-light fc-white">mainField1</p>
                    <p className="t-large t-light fc-asphalt">mainField1</p>
                    <div className="media-track__time">
                        <span className="t-small t-medium fc-bright-blue">startTime </span><span className="t-small t-medium fc-asphalt">/ endTime</span>
                    </div>
                </div>
            </div>
        )
    }
}
