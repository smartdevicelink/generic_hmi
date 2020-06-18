import React from 'react';
import {ReactComponent as WeatherIcon} from "../img/app_services/weather.svg";
import StaticIcon from './Templates/Shared/StaticIcon'
import Image from './Templates/Shared/Image'

export default class WeatherServiceImage extends React.Component {
    render() {
        var icon = this.props.image
        if (icon) {
            if (icon.imageType === "STATIC") {
                return (
                    <div className="app-service-icon svg-size weather-color">
                        <StaticIcon class="static-icon" image={icon.value} />
                    </div>
                )                
            } else {
                return (
                    <div className="app-service-icon weather-color">
                        <Image image={icon.value} 
                            isTemplate={icon.isTemplate}
                            fillColor={"#FFFFFF"}/>
                    </div>
                )
            }
        } else {
            return (
                <span className="svg-size  weather-color ">
                    <WeatherIcon/>
                </span>
            );
        }
    }
}
