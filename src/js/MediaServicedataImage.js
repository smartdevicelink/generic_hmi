import React from 'react';
import mediaIcon from "../img/app_services/media.svg";
import StaticIcon from './Templates/Shared/StaticIcon'
import Image from './Templates/Shared/Image'

export default class MediaServiceDataImage extends React.Component {

    constructor() {
        super();
    }

    fillColor() {
        var fillColor = null;
        if (this.props.theme) {
            fillColor = "#FFFFFF"
        } else {
            fillColor = "#000000"
        }
        return fillColor;        
    }

    render() {
        var image = this.props.image
        if (image) {
            if (image.imageType === "STATIC") {
                return (
                    <div className="app-service-media-icon">
                        <StaticIcon class="static-icon" image={image.value} />
                    </div>
                )                
            } else {
                return (
                    <div className="app-service-media-icon">
                        <Image image={image.value} 
                            isTemplate={image.isTemplate}
                            fillColor={this.fillColor}/>
                    </div>
                )
            }
        } else {
            return (
                <span className="svg-size  media-color " 
                    dangerouslySetInnerHTML={{__html: mediaIcon}} /> 
            );
        }
      

    }

}