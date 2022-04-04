import React from 'react';
import StaticIcon from '../Shared/StaticIcon'
import Image from '../Shared/Image'

export default class DoubleGraphicBody extends React.Component {
    fillColor() {
        var fillColor = null;
        if (this.props.theme) {
            fillColor = "#FFFFFF"
        } else {
            fillColor = "#000000"
        }
        return fillColor;        
    }

    primaryGraphic() {
        if(this.props.graphic) {
            var image;
            if(this.props.graphic.imageType === "STATIC") {
                image = <StaticIcon class="double-graphic" image={this.props.graphic.value} />
            } else {
                image = <Image class="double-graphic" 
                    image={this.props.graphic.value} 
                    isTemplate={this.props.graphic.isTemplate}
                    fillColor={this.fillColor()}/>
            }
            return (
                <div className="double-graphic-container">
                    { image }
                </div>
            );
        } else {
            return null
        }
    }

    secondaryGraphic() {
        if(this.props.secondaryGraphic) {
            var image;
            if(this.props.secondaryGraphic.imageType === "STATIC") {
                image = <StaticIcon class="double-graphic" image={this.props.secondaryGraphic.value} />
            } else {
                image = <Image class="double-graphic" 
                    image={this.props.secondaryGraphic.value} 
                    isTemplate={this.props.secondaryGraphic.isTemplate}
                    fillColor={this.fillColor()}/>
            }
            return (
                <div className="double-graphic-container">
                    { image }
                </div>
            );
        } else {
            return null
        }
    }

    render() {
        return (
            <div className={this.props.class}>
                {this.primaryGraphic()}
                {this.secondaryGraphic()}
            </div>
        )
    }
}