import React from 'react';
import StaticIcon from './Templates/Shared/StaticIcon'
import Image from './Templates/Shared/Image'

import {ReactComponent as IconSeekLeft} from '../img/icons/icon-seek-left.svg';
import {ReactComponent as IconSeekRight} from '../img/icons/icon-seek-right.svg';
import {ReactComponent as IconPlay} from '../img/icons/icon-play.svg';
import {ReactComponent as IconPause} from '../img/icons/icon-pause.svg';
import {ReactComponent as IconPlayPause} from '../img/icons/icon-play-pause.svg';
import {ReactComponent as IconStop} from '../img/icons/icon-stop.svg';

export default class ControlBar extends React.Component {
    fillColor() {
        var fillColor = null;
        if (this.props.theme) {
            fillColor = "#FFFFFF"
        } else {
            fillColor = "#000000"
        }
        return fillColor;
    }

    getIcon(icon) {
        switch(icon) {
            case "iconSeekLeft":
                return <IconSeekLeft/>
            case "iconSeekRight":
                return <IconSeekRight/>
            case "iconPlay":
                return <IconPlay/>
            case "iconPause":
                return <IconPause/>
            case "iconPlayPause":
                return <IconPlayPause/>
            case "iconStop":
                return <IconStop/>
        }
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
            var fillColor = this.props.highlightColor ? this.props.highlightColor : this.fillColor()
            var image = this.props.icon ?
                <span key="icon" className="svg-wrap">{this.getIcon(this.props.icon)}</span> :
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
