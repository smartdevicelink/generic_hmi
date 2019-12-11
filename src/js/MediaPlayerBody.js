import React from 'react';

import AlbumArt from './AlbumArt';
import MediaTrackInfo from './containers/MediaTrackInfo_c'
import {UseDarkText} from './calculate_text_color';

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
            if (UseDarkText(this.props.colorScheme) && this.props.theme === true) {
                cssColorScheme = {
                    backgroundColor: `rgb(${redInt}, ${greenInt}, ${blueInt})`,
                    color: '#000000'
                }                
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
        var colorScheme = null;
        colorScheme = this.getColorScheme();
        return (
            <div className="media-player-body" style={colorScheme}>
                <AlbumArt image={value} imageType={type} isTemplate={templateImage} theme={theme}/>
                <div className="media-track">
                    <div className="media-metadata">
                        <p className="t-small t-medium th-f-color truncate" style={colorScheme}>{this.props.mainField3}</p>
                        <p className="t-large t-light th-f-color truncate" style={colorScheme}>{this.props.mainField1}</p>
                        <p className="t-large t-light th-f-color-secondary truncate" style={colorScheme}>{this.props.mainField2}</p>
                    </div>
                    <MediaTrackInfo />
                </div>
            </div>
        )
    }
}
