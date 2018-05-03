import React from 'react';

import AlbumArt from './AlbumArt';
import MediaTrackInfo from './containers/MediaTrackInfo_c'

export default class MediaPlayerBody extends React.Component {
    constructor(props) {
        super(props);
    }

    getColorScheme() {
        if (this.props.colorScheme) {
            var redInt = this.props.colorScheme.red;
            var blueInt = this.props.colorScheme.blue;
            var greenInt = this.props.colorScheme.green;
            var cssColorScheme = {
                backgroundColor: `rgb(${redInt}, ${greenInt}, ${blueInt})`
            }
            return cssColorScheme;
        } else {
            return null;
        }
    }

    render() {
        return (
            <div className="media-player-body" style={this.getColorScheme()}>
                <AlbumArt image={this.props.graphic} />
                <div className="media-track">
                    <div className="media-metadata">
                        <p className="t-small t-medium th-f-color">{this.props.mainField3}</p>
                        <p className="t-large t-light th-f-color">{this.props.mainField1}</p>
                        <p className="t-large t-light th-f-color-secondary">{this.props.mainField2}</p>
                    </div>
                    <MediaTrackInfo />
                </div>
            </div>
        )
    }
}
