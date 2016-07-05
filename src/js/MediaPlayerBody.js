import React from 'react';

import AlbumArt from './AlbumArt';

export default class MediaPlayerBody extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="media-player-body">
                <AlbumArt image={this.props.graphic} />
                <div className="media-track">
                    <p className="t-small t-medium th-f-color">{this.props.mainField3}</p>
                    <p className="t-large t-light th-f-color">{this.props.mainField1}</p>
                    <p className="t-large t-light th-f-color-secondary">{this.props.mainField2}</p>
                    <div className="media-track__time">
                        <span className="t-small t-medium fc-bright-blue">startTime </span><span className="t-small t-medium fc-slate">/ endTime</span>
                    </div>
                </div>
            </div>
        )
    }
}
