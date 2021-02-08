import React from 'react';
import StaticIcon from './Templates/Shared/StaticIcon'
import Image from './Templates/Shared/Image'

import {ReactComponent as IconSkipLeft} from '../img/icons/icon-skip-left.svg';
import {ReactComponent as IconSkipRight} from '../img/icons/icon-skip-right.svg';
import {ReactComponent as IconPlay} from '../img/icons/icon-play.svg';
import {ReactComponent as IconPause} from '../img/icons/icon-pause.svg';
import {ReactComponent as IconPlayPause} from '../img/icons/icon-play-pause.svg';
import {ReactComponent as IconStop} from '../img/icons/icon-stop.svg';
import IconSeekLeftWithText from '../img/dynamic/IconSeekLeftWithText';
import IconSeekRightWithText from '../img/dynamic/IconSeekRightWithText';

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

    getIcon(icon, iconProps) {
        switch(icon) {
            case "iconSkipLeft":
                return <IconSkipLeft/>
            case "iconSkipRight":
                return <IconSkipRight/>
            case "iconSeekLeft":
                return <IconSeekLeftWithText {...iconProps} />
            case "iconSeekRight":
                return <IconSeekRightWithText {...iconProps} />
            case "iconPlay":
                return <IconPlay/>
            case "iconPause":
                return <IconPause/>
            case "iconPlayPause":
                return <IconPlayPause/>
            case "iconStop":
                return <IconStop/>
            default:
                return null
        }
    }

    render() {
        if(this.props.imageType === "STATIC") {
            return (
                <div className={`control-bar__control th-b-color-secondary control-bar__control--${ this.props.class }`}
                    /*onClick={() => this.props.onButtonPress(this.props.appID, this.props.id, this.props.name)}*/
                    onMouseDown={() => this.props.onButtonDown(this.props.appID, this.props.id, this.props.name)}
                    onMouseUp={() => this.props.onButtonUp(this.props.appID, this.props.id, this.props.name)}
                >
                    <StaticIcon class="static-icon" image={this.props.image} />
                </div>
            )            
        } else {
            var fillColor = this.props.highlightColor ? this.props.highlightColor : this.fillColor()
            var image = this.props.icon ?
                <span key="icon" className="svg-wrap">{this.getIcon(this.props.icon, this.props.iconProps)}</span> :
                (<Image key="image" image={this.props.image} isTemplate={this.props.isTemplate} fillColor={fillColor}/>)

            return (
                <div
                    className={`control-bar__control th-b-color-secondary control-bar__control--${ this.props.class }`}
                    /*onClick={() => this.props.onButtonPress(this.props.appID, this.props.id, this.props.name)}*/
                    onMouseDown={() => this.props.onButtonDown(this.props.appID, this.props.id, this.props.name)}
                    onMouseUp={() => this.props.onButtonUp(this.props.appID, this.props.id, this.props.name)}
                >
                        {image}
                </div>
            )
        }
    }
}
