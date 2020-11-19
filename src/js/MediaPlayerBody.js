import React from 'react';

import AlbumArt from './AlbumArt';
import MediaTrackInfo from './containers/MediaTrackInfo_c'

export default class MediaPlayerBody extends React.Component {
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
        var value = null;
        var type = null;
        var templateImage = null;
        var theme = null;
        if(this.props.graphic) {
            value = this.props.graphic.value ? this.props.graphic.value : null;
            type = this.props.graphic.imageType ? this.props.graphic.imageType : null;
            templateImage = this.props.graphic.isTemplate ? this.props.graphic.isTemplate : null;
            theme = this.props.theme ? this.props.theme : null;
        }
        return (
            <div className="media-player-body" style={this.getColorScheme()}>
                <AlbumArt image={value} imageType={type} isTemplate={templateImage} theme={theme}/>
                <div className="media-track">
                    <div className="media-metadata">
                        <p className="t-small t-medium th-f-color">{this.props.mainField3}</p>
                        <p className="t-large t-light th-f-color">{this.props.mainField1}</p>
                        <p className="t-large t-light th-f-color-secondary">{this.props.mainField2}</p>
                        <p className="t-small t-light th-f-color-secondary">{this.props.mediaTrack}</p>
                    </div>
                    <MediaTrackInfo />
                </div>
            </div>
        )
    }
}
