import React from 'react';
import StaticIcon from './StaticIcon'
import Image from './Image'


export default class LargeGraphicBody extends React.Component {
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
        if(this.props.graphic) {
            if(this.props.graphic.imageType === "STATIC") {
                return (
                    <div className={this.props.class}>            
                        <StaticIcon class="large-graphic" image={this.props.graphic.value} />
                    </div>
                )
            } else {
                return (
                    <div className={this.props.class}>            
                        <Image class="large-graphic" 
                            image={this.props.graphic.value} 
                            isTemplate={this.props.graphic.isTemplate}
                            fillColor={this.fillColor()}/>
                    </div>
                )
            }

        } else {
            return (null)
        }
    }
}