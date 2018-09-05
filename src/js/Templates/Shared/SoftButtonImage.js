import React from 'react';
import StaticIcon from './StaticIcon'
import Image from './Image'

export default class SoftButtonImage extends React.Component {
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
            var className = this.props.class ? this.props.class : "soft-button-image";
            if(this.props.imageType === "STATIC") {
                return (
                    <div className={className}>
                        <StaticIcon image={this.props.image} />
                    </div>
                )
            } else {
                return (
                    <div className={className}>
                        <Image image={this.props.image} 
                            isTemplate={this.props.isTemplate}
                            fillColor={this.fillColor()}/>
                    </div>
                )
            }
        } else {
            return(null)
        }
    }
}
