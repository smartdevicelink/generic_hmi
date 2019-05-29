import React from 'react';
import navIcon from "../img/app_services/navigation.svg";
import StaticIcon from './Templates/Shared/StaticIcon'
import Image from './Templates/Shared/Image'

export default class NavInstructionImage extends React.Component {

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
                    <div className="app-service-icon svg-size">
                        <StaticIcon class="static-icon" image={image.value} />
                    </div>
                )                
            } else {
                return (
                    <div className="app-service-icon">
                        <Image image={image.value} 
                            isTemplate={image.isTemplate}
                            fillColor={this.fillColor}/>
                    </div>
                )
            }
        } else {
            return (
                <span className="svg-size  nav-color " 
                    dangerouslySetInnerHTML={{__html: navIcon}} /> 
            );
        }
    }
}
