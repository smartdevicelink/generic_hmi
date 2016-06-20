import React from 'react';

import AlbumArt from './AlbumArt';

export default class MediaPlayerBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mainField1: 'Every Tear Disappears',
            mainField2: 'St. Vincent',
            mainField3: 'St. Vincent'
        }
    }

    render() {
        return (
            <div className="media-player-body">
                <AlbumArt image="http://www.unrecorded.mu/wp-content/uploads/2014/02/St.-Vincent-St.-Vincent1.jpg" />
                <div className="media-track">
                    <p className="t-small t-medium fc-white">{this.state.mainField3}</p>
                    <p className="t-large t-light fc-white">{this.state.mainField1}</p>
                    <p className="t-large t-light fc-slate">{this.state.mainField2}</p>
                    <div className="media-track__time">
                        <span className="t-small t-medium fc-bright-blue">startTime </span><span className="t-small t-medium fc-slate">/ endTime</span>
                    </div>
                </div>
            </div>
        )
    }
}
