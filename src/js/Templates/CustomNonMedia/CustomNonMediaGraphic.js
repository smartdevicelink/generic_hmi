import React from 'react';
import StaticIcon from '../Shared/StaticIcon'
import Image from '../Shared/Image'

export default class NonMediaGraphic extends React.Component {
    constructor(props) {
        super(props);
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
        if(this.props.image) {
            if(this.props.image.imageType === "STATIC") {
                return (
                    <div className="custom-non-media-graphic">
                        <StaticIcon class="static-icon" image={this.props.image.value} />
                    </div>
                )
            } else {
                return (
                    <div className="custom-non-media-graphic">
                        <Image image={this.props.image.value} 
                            isTemplate={this.props.image.isTemplate}
                            fillColor={this.fillColor()}/>
                    </div>
                )
            }
        } else {
            return(null)
        }
    }
}