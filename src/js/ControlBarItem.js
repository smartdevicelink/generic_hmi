import React from 'react';
import StaticIcon from './Templates/Shared/StaticIcon'
import Image from './Templates/Shared/Image'
export default class ControlBar extends React.Component {
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
        if(this.props.imageType === "STATIC") {
            return (
                <div className={`control-bar__control th-b-color-secondary control-bar__control--${ this.props.class }`}
                    onClick={() => this.props.onButtonPress(this.props.appID, this.props.id, this.props.name)}>
                    <StaticIcon class="static-icon" image={this.props.image} />
                </div>
            )            
        } else {
            var fillColor = this.fillColor()
            var image = this.props.icon ?
                <span key="icon" className="svg-wrap" dangerouslySetInnerHTML={{__html: this.props.icon}} /> :
                (<Image key="image" image={this.props.image} isTemplate={this.props.isTemplate} fillColor={fillColor}/>)

            return (
                <div
                    className={`control-bar__control th-b-color-secondary control-bar__control--${ this.props.class }`}
                    onClick={() => this.props.onButtonPress(this.props.appID, this.props.id, this.props.name)}>
                        {image}
                </div>
            )
        }
    }
}
