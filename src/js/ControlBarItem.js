import React from 'react';
import StaticIcon from './Templates/Shared/StaticIcon'
export default class ControlBar extends React.Component {
    constructor(props) {
        super(props);
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
            var image = this.props.icon ?
                <span key="icon" className="svg-wrap" dangerouslySetInnerHTML={{__html: this.props.icon}} /> :
                <img key="image" src={this.props.image} />
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
