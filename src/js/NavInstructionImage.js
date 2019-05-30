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
        if (this.props.theme === undefined) {
            // Special case for images in the nav bar.
            // They should always be white.
            fillColor = "#FFFFFF"
        } else if (this.props.theme) {
            fillColor = "#FFFFFF"
        } else {
            fillColor = "#000000"
        }
        return fillColor;        
    }

    render() {
        var image = this.props.image
        console.log("Nav Instruction Image")
        console.log(this.props)
        if (image) {
            if (image.imageType === "STATIC") {
                return (
                    <div className="app-service-icon svg-size nav-color">
                        <StaticIcon class="static-icon" image={image.value} />
                    </div>
                )                
            } else {
                return (
                    <div className="app-service-icon nav-color">
                        <Image image={image.value} 
                            isTemplate={image.isTemplate}
                            fillColor={this.fillColor()}/>
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
