import React from 'react';
import weatherIcon from "../img/app_services/weather.svg";
import StaticIcon from './Templates/Shared/StaticIcon'
import Image from './Templates/Shared/Image'
import WeatherServiceImage from './WeatherServiceImage';

export default class WeatherButton extends React.Component {

    constructor() {
        super();
    }

    render() {

        if (this.props.temp) {
            return (
                <div className="th-nav-background-color nav-text-bubble"> 
                        <p className="t-small t-medium th-f-color">
                            {this.props.temp + "°"}
                        </p>
                </div>
            )
        }
        var icon = this.props.weatherIcon
        return (<WeatherServiceImage image={icon}/>)
    }
}
