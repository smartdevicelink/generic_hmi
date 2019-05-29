import React from 'react';
import weatherIcon from "../img/app_services/weather.svg";
import StaticIcon from './Templates/Shared/StaticIcon'
import Image from './Templates/Shared/Image'

export default class WeatherServiceImage extends React.Component {

    constructor() {
        super();
    }

    render() {
        var icon = this.props.image
        console.log("WeatherServiceImage: " + JSON.stringify(this.props, null, 2))
        if (icon) {
            if (icon.imageType === "STATIC") {
                return (
                    <div className="app-service-icon svg-size">
                        <StaticIcon class="static-icon" image={icon.value} />
                    </div>
                )                
            } else {
                return (
                    <div className="app-service-icon">
                        <Image image={icon.value} 
                            isTemplate={icon.isTemplate}
                            fillColor={"#FFFFFF"}/>
                    </div>
                )
            }
        } else {
            return (
                <span className="svg-size  weather-color " 
                    dangerouslySetInnerHTML={{__html: weatherIcon}} /> 
            );
        }     

    }

}